from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
import os
import shutil
import uuid
from datetime import datetime
from typing import Optional, List
import wfdb
import numpy as np
from scipy import signal
import json
import tempfile

from database import get_db
from models.patient import Patient
from models.analysis_session import AnalysisSession, AnalysisStatus
from utils.auth import get_current_user
from mai_dxo_pipeline import process_patient_with_mai_dxo

router = APIRouter()

# File upload constants
UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB for .dat files
MAX_HEADER_SIZE = 5 * 1024 * 1024  # 5MB for .hea files
ALLOWED_EXTENSIONS = {'.dat', '.hea'}

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)

def extract_normalized_vital_signs(dat_normalized_path: str, hea_normalized_path: str) -> dict:
    """Extract vital signs from normalized WFDB files"""
    try:
        # Load normalized WFDB record
        record_name = dat_normalized_path.replace('.dat', '')
        record = wfdb.rdrecord(record_name)
        
        # Get signals and names
        signals = record.p_signal
        signal_names = record.sig_name
        
        # Initialize normalized vital signs
        normalized_vitals = {
            'heart_rate_bpm': None,
            'pulse_rate_bpm': None,
            'respiratory_rate_bpm': None,
            'spo2_percent': None,
            'sampling_frequency': record.fs,
            'duration_seconds': len(signals) / record.fs if len(signals) > 0 else 0
        }
        
        # Extract vital signs from each signal
        for i, signal_name in enumerate(signal_names):
            if i < signals.shape[1]:
                signal_data = signals[:, i]
                
                # Remove invalid values
                signal_data = signal_data[~np.isnan(signal_data)]
                signal_data = signal_data[signal_data != -32768]  # Common invalid value
                
                if len(signal_data) > 0:
                    # Calculate statistics
                    mean_val = float(np.mean(signal_data))
                    std_val = float(np.std(signal_data))
                    
                    # Map signal types to vital signs
                    if 'HR' in signal_name.upper():
                        normalized_vitals['heart_rate_bpm'] = mean_val
                    elif 'PULSE' in signal_name.upper():
                        normalized_vitals['pulse_rate_bpm'] = mean_val
                    elif 'RESP' in signal_name.upper():
                        normalized_vitals['respiratory_rate_bpm'] = mean_val
                    elif 'SPO2' in signal_name.upper():
                        normalized_vitals['spo2_percent'] = mean_val
        
        return normalized_vitals
        
    except Exception as e:
        print(f"Warning: Could not extract normalized vital signs: {str(e)}")
        return {
            'heart_rate_bpm': None,
            'pulse_rate_bpm': None,
            'respiratory_rate_bpm': None,
            'spo2_percent': None,
            'sampling_frequency': 1,
            'duration_seconds': 0
        }

def extract_breathing_annotations(breath_annotation_path: str) -> dict:
    """Extract breathing pattern annotations from .breath file"""
    try:
        with open(breath_annotation_path, 'rb') as f:
            content = f.read()
        
        # Basic analysis of breathing annotations
        breathing_data = {
            'file_size_bytes': len(content),
            'annotation_count': content.count(b'ann'),  # Count annotation markers
            'breathing_events': content.count(b'Y'),    # Count breathing events
            'inspiration_markers': content.count(b'X'), # Count inspiration markers
            'has_annotations': len(content) > 0
        }
        
        return breathing_data
        
    except Exception as e:
        print(f"Warning: Could not extract breathing annotations: {str(e)}")
        return {
            'file_size_bytes': 0,
            'annotation_count': 0,
            'breathing_events': 0,
            'inspiration_markers': 0,
            'has_annotations': False
        }

def extract_vital_signs_features(dat_file_path: str, hea_file_path: str) -> dict:
    """Extract vital signs features from WFDB files"""
    try:
        # Verify files exist
        if not os.path.exists(dat_file_path):
            raise FileNotFoundError(f"DAT file not found: {dat_file_path}")
        if not os.path.exists(hea_file_path):
            raise FileNotFoundError(f"HEA file not found: {hea_file_path}")
        
        # Load WFDB record (path without extension)
        record_name = dat_file_path.replace('.dat', '')
        record = wfdb.rdrecord(record_name)
        
        # Get sampling frequency
        fs = record.fs
        
        # Extract signals
        signals = record.p_signal
        signal_names = record.sig_name
        
        # Analysis window: final 2 minutes (physiological stabilization)
        analysis_duration = 120  # seconds
        analysis_samples = analysis_duration * fs
        
        # Take final 2 minutes of data
        if signals.shape[0] > analysis_samples:
            signals = signals[-analysis_samples:]
        
        # Create time vector
        time_vector = np.linspace(0, analysis_duration, signals.shape[0])
        
        # Initialize features dictionary
        features = {
            'analysis_window': f"Final {analysis_duration} seconds",
            'sampling_frequency': fs,
            'signals_available': signal_names,
            'analysis_duration': analysis_duration
        }
        
        # Process each signal type
        for i, signal_name in enumerate(signal_names):
            if i < signals.shape[1]:
                signal_data = signals[:, i]
                
                # Remove NaN values
                signal_data = signal_data[~np.isnan(signal_data)]
                
                if len(signal_data) > 0:
                    # Basic statistics
                    signal_stats = {
                        'mean': float(np.mean(signal_data)),
                        'std': float(np.std(signal_data)),
                        'min': float(np.min(signal_data)),
                        'max': float(np.max(signal_data)),
                        'median': float(np.median(signal_data))
                    }
                    
                    # Process specific signal types
                    if 'PLETH' in signal_name.upper() or 'SPO2' in signal_name.upper():
                        # SpO2 Processing
                        features['spo2'] = {
                            **signal_stats,
                            'desaturation_events': int(np.sum(signal_data < 90)),
                            'normal_range': signal_stats['mean'] >= 95,
                            'trend': 'stable' if signal_stats['std'] < 2 else 'variable'
                        }
                    
                    elif 'PULSE' in signal_name.upper():
                        # Pulse Rate Processing
                        features['pulse_rate'] = {
                            **signal_stats,
                            'variability': signal_stats['std'],
                            'normal_range': 60 <= signal_stats['mean'] <= 100,
                            'rhythm': 'regular' if signal_stats['std'] < 10 else 'irregular'
                        }
                    
                    elif 'ECG' in signal_name.upper() or 'II' in signal_name.upper():
                        # Heart Rate Processing with R-peak detection for HRV
                        from scipy.signal import find_peaks
                        
                        # Normalize ECG signal for peak detection
                        ecg_normalized = (signal_data - np.mean(signal_data)) / (np.std(signal_data) + 1e-8)
                        
                        # Find R-peaks (adjust parameters based on sampling rate)
                        min_distance = int(0.6 * fs)  # Minimum 600ms between peaks
                        height_threshold = 1.5  # Above 1.5 standard deviations
                        
                        peaks, _ = find_peaks(ecg_normalized, 
                                            height=height_threshold, 
                                            distance=min_distance)
                        
                        # Calculate HRV metrics if we have enough peaks
                        hrv_metrics = {'SDNN': 0.0, 'RMSSD': 0.0, 'pNN50': 0.0}
                        
                        if len(peaks) >= 10:  # Need at least 10 peaks for reliable HRV
                            # Calculate RR intervals in milliseconds
                            rr_intervals = np.diff(peaks) / fs * 1000
                            
                            # SDNN: Standard deviation of NN intervals
                            hrv_metrics['SDNN'] = float(np.std(rr_intervals))
                            
                            # RMSSD: Root mean square of successive differences
                            rr_diffs = np.diff(rr_intervals)
                            hrv_metrics['RMSSD'] = float(np.sqrt(np.mean(rr_diffs**2)))
                            
                            # pNN50: Percentage of successive NN intervals > 50ms
                            nn50_count = np.sum(np.abs(rr_diffs) > 50)
                            hrv_metrics['pNN50'] = float(nn50_count / len(rr_diffs) * 100)
                        
                        features['heart_rate'] = {
                            **signal_stats,
                            'hrv_metrics': hrv_metrics,
                            'r_peaks_detected': len(peaks),
                            'normal_range': 60 <= signal_stats['mean'] <= 100,
                            'arrhythmia_risk': 'low' if signal_stats['std'] < 15 else 'moderate'
                        }
                    
                    elif 'RESP' in signal_name.upper():
                        # Respiratory Rate Processing
                        features['respiratory_rate'] = {
                            **signal_stats,
                            'normal_range': 12 <= signal_stats['mean'] <= 20,
                            'episodes_high': int(np.sum(signal_data > 20)),
                            'episodes_low': int(np.sum(signal_data < 12)),
                            'trend': 'stable' if signal_stats['std'] < 3 else 'variable'
                        }
                        
                        # Breathing pattern analysis
                        features['breathing_pattern'] = {
                            'cycle_duration': float(60 / signal_stats['mean']),  # seconds per breath
                            'amplitude_variability': signal_stats['std'],
                            'pattern_classification': 'normal' if signal_stats['std'] < 3 else 'irregular'
                        }
                        
                        # Respiratory waveform analysis
                        features['respiratory_waveform'] = {
                            'shape_analysis': 'sinusoidal',
                            'skewness': float(signal_data.std() / signal_data.mean() if signal_data.mean() != 0 else 0),
                            'ie_ratio': 1.5,  # Typical inspiratory:expiratory ratio
                            'rhythm_classification': 'regular' if signal_stats['std'] < 3 else 'irregular'
                        }
        
        return features
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing vital signs: {str(e)}")

def determine_ai_risk_level(features: dict) -> str:
    """Determine AI risk level based on vital signs features"""
    try:
        # Extract key vital signs
        heart_rate = features.get("heart_rate_bpm", 0)
        respiratory_rate = features.get("respiratory_rate_bpm", 0)
        spo2 = features.get("spo2_percent", 100)
        
        # High risk conditions
        if (heart_rate > 100 or heart_rate < 60 or
            respiratory_rate > 24 or respiratory_rate < 12 or
            spo2 < 95):
            return "HIGH"
        
        # Moderate risk conditions  
        if (heart_rate > 90 or heart_rate < 65 or
            respiratory_rate > 20 or respiratory_rate < 14 or
            spo2 < 97):
            return "MEDIUM"
        
        # Low risk (normal)
        return "LOW"
        
    except Exception:
        return "LOW"  # Default to low risk if calculation fails

def create_mai_dxo_patient_data(patient_data: dict, features: dict, clinical_notes: dict) -> dict:
    """Create MAI-DxO patient data structure"""
    
    # Extract vital signs for MAI-DxO
    vital_signs = {
        'heart_rate': features.get('heart_rate', {}).get('mean', 0),
        'blood_pressure': {'systolic': 120, 'diastolic': 80},  # Default values
        'respiratory_rate': features.get('respiratory_rate', {}).get('mean', 0),
        'oxygen_saturation': features.get('spo2', {}).get('mean', 0),
        'temperature': 36.5,  # Default normal temperature
        'pulse_rate': features.get('pulse_rate', {}).get('mean', 0)
    }
    
    # Risk assessment based on vital signs
    risk_factors = []
    risk_level = "LOW"
    
    # Check for abnormal vital signs
    if vital_signs['heart_rate'] > 100 or vital_signs['heart_rate'] < 60:
        risk_factors.append(f"Heart rate: {vital_signs['heart_rate']} bpm")
        risk_level = "MEDIUM"
    
    if vital_signs['respiratory_rate'] > 20 or vital_signs['respiratory_rate'] < 12:
        risk_factors.append(f"Respiratory rate: {vital_signs['respiratory_rate']} bpm")
        risk_level = "MEDIUM"
    
    if vital_signs['oxygen_saturation'] < 95:
        risk_factors.append(f"Low SpO2: {vital_signs['oxygen_saturation']}%")
        risk_level = "HIGH"
    
    # Create MAI-DxO patient data
    mai_dxo_data = {
        'patient_info': {
            'patient_id': patient_data['patient_id'],
            'name': patient_data['full_name'],
            'age': patient_data['age'],
            'gender': patient_data.get('gender', 'Unknown')
        },
        'medical_history': {
            'conditions': patient_data.get('conditions', []),
            'medications': patient_data.get('medications', []),
            'allergies': patient_data.get('allergies', []),
            'surgical_history': patient_data.get('surgical_history', [])
        },
        'vital_signs_data': vital_signs,
        'symptoms_context': {
            'chief_complaint': clinical_notes.get('chief_complaint', ''),
            'symptoms': clinical_notes.get('symptoms', []),
            'pain_scale': clinical_notes.get('pain_scale', 0),
            'symptom_duration': clinical_notes.get('symptom_duration', ''),
            'staff_observations': clinical_notes.get('staff_notes', '')
        },
        'clinical_assessment': {
            'risk_level': risk_level,
            'risk_factors': risk_factors,
            'preliminary_notes': f"Vital signs analysis completed. {len(risk_factors)} risk factors identified."
        }
    }
    
    return mai_dxo_data

@router.post("/upload-vital-signs")
async def upload_vital_signs(
    patient_id: str = Form(...),
    chief_complaint: str = Form(...),
    symptoms: str = Form(...),  # JSON string of symptoms array
    pain_scale: int = Form(...),
    symptom_duration: str = Form(...),
    temperature: str = Form(""),  # Body temperature in Celsius
    staff_notes: str = Form(""),
    dat_file: UploadFile = File(...),
    hea_file: UploadFile = File(...),
    dat_normalized_file: UploadFile = File(...),
    hea_normalized_file: UploadFile = File(...),
    breath_annotation_file: UploadFile = File(...),
    video_file: UploadFile = File(None),  # Optional video file
    db: Session = Depends(get_db)
    # TODO: Re-enable authentication: current_user: dict = Depends(get_current_user)
):
    """Upload vital signs files and process them"""
    
    try:
        # Validate file extensions
        if not dat_file.filename.endswith('.dat'):
            raise HTTPException(status_code=400, detail="DAT file must have .dat extension")
        if not hea_file.filename.endswith('.hea'):
            raise HTTPException(status_code=400, detail="HEA file must have .hea extension")
        if not dat_normalized_file.filename.endswith('.dat'):
            raise HTTPException(status_code=400, detail="Normalized DAT file must have .dat extension")
        if not hea_normalized_file.filename.endswith('.hea'):
            raise HTTPException(status_code=400, detail="Normalized HEA file must have .hea extension")
        if not breath_annotation_file.filename.endswith('.breath'):
            raise HTTPException(status_code=400, detail="Breath annotation file must have .breath extension")
        
        # Check file sizes
        dat_content = await dat_file.read()
        hea_content = await hea_file.read()
        dat_normalized_content = await dat_normalized_file.read()
        hea_normalized_content = await hea_normalized_file.read()
        breath_annotation_content = await breath_annotation_file.read()
        
        if len(dat_content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="DAT file too large (max 50MB)")
        if len(hea_content) > MAX_HEADER_SIZE:
            raise HTTPException(status_code=400, detail="HEA file too large (max 5MB)")
        if len(dat_normalized_content) > 10 * 1024 * 1024:  # 10MB
            raise HTTPException(status_code=400, detail="Normalized DAT file too large (max 10MB)")
        if len(hea_normalized_content) > 2 * 1024 * 1024:  # 2MB
            raise HTTPException(status_code=400, detail="Normalized HEA file too large (max 2MB)")
        if len(breath_annotation_content) > MAX_HEADER_SIZE:
            raise HTTPException(status_code=400, detail="Breath annotation file too large (max 5MB)")
        
        # Get patient data
        patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        # Create unique session ID
        session_id = str(uuid.uuid4())
        
        # Create session directory
        session_dir = os.path.join(UPLOAD_DIR, session_id)
        os.makedirs(session_dir, exist_ok=True)
        
        # Save files with original names (wfdb requires this)
        print(f"DEBUG: Received filenames:")
        print(f"  DAT filename: {dat_file.filename}")
        print(f"  HEA filename: {hea_file.filename}")
        print(f"  DAT normalized filename: {dat_normalized_file.filename}")
        print(f"  HEA normalized filename: {hea_normalized_file.filename}")
        print(f"  Breath annotation filename: {breath_annotation_file.filename}")
        
        dat_path = os.path.join(session_dir, dat_file.filename)
        hea_path = os.path.join(session_dir, hea_file.filename)
        dat_normalized_path = os.path.join(session_dir, dat_normalized_file.filename)
        hea_normalized_path = os.path.join(session_dir, hea_normalized_file.filename)
        breath_annotation_path = os.path.join(session_dir, breath_annotation_file.filename)
        
        with open(dat_path, "wb") as f:
            f.write(dat_content)
        with open(hea_path, "wb") as f:
            f.write(hea_content)
        with open(dat_normalized_path, "wb") as f:
            f.write(dat_normalized_content)
        with open(hea_normalized_path, "wb") as f:
            f.write(hea_normalized_content)
        with open(breath_annotation_path, "wb") as f:
            f.write(breath_annotation_content)
            
        print(f"DEBUG: Files saved to:")
        print(f"  DAT path: {dat_path}")
        print(f"  HEA path: {hea_path}")
        print(f"  DAT normalized path: {dat_normalized_path}")
        print(f"  HEA normalized path: {hea_normalized_path}")
        print(f"  Breath annotation path: {breath_annotation_path}")
        
        # Verify files exist
        if not os.path.exists(dat_path):
            raise HTTPException(status_code=500, detail=f"Failed to save DAT file: {dat_path}")
        if not os.path.exists(hea_path):
            raise HTTPException(status_code=500, detail=f"Failed to save HEA file: {hea_path}")
        if not os.path.exists(dat_normalized_path):
            raise HTTPException(status_code=500, detail=f"Failed to save normalized DAT file: {dat_normalized_path}")
        if not os.path.exists(hea_normalized_path):
            raise HTTPException(status_code=500, detail=f"Failed to save normalized HEA file: {hea_normalized_path}")
        if not os.path.exists(breath_annotation_path):
            raise HTTPException(status_code=500, detail=f"Failed to save breath annotation file: {breath_annotation_path}")
        
        # Extract vital signs features
        print(f"DEBUG: Attempting to read files:")
        print(f"  DAT file: {dat_path}")
        print(f"  HEA file: {hea_path}")
        print(f"  DAT exists: {os.path.exists(dat_path)}")
        print(f"  HEA exists: {os.path.exists(hea_path)}")
        
        # If files don't exist with expected names, find them by extension
        if not os.path.exists(dat_path) or not os.path.exists(hea_path):
            print("DEBUG: Files not found with expected names, searching by extension...")
            for filename in os.listdir(session_dir):
                file_path = os.path.join(session_dir, filename)
                if filename.endswith('.dat'):
                    dat_path = file_path
                    print(f"  Found DAT file: {dat_path}")
                elif filename.endswith('.hea'):
                    hea_path = file_path
                    print(f"  Found HEA file: {hea_path}")
        
        # Extract features from raw ECG data
        features = extract_vital_signs_features(dat_path, hea_path)
        
        # Extract normalized vital signs
        normalized_vitals = extract_normalized_vital_signs(dat_normalized_path, hea_normalized_path)
        
        # Extract breathing annotations
        breathing_annotations = extract_breathing_annotations(breath_annotation_path)
        
        # Combine all features
        features['normalized_vitals'] = normalized_vitals
        features['breathing_annotations'] = breathing_annotations
        
        # Use normalized vital signs as primary values if available
        if normalized_vitals['heart_rate_bpm'] is not None:
            features['heart_rate_bpm'] = normalized_vitals['heart_rate_bpm']
        if normalized_vitals['pulse_rate_bpm'] is not None:
            features['pulse_rate_bpm'] = normalized_vitals['pulse_rate_bpm']
        if normalized_vitals['respiratory_rate_bpm'] is not None:
            features['respiratory_rate_bpm'] = normalized_vitals['respiratory_rate_bpm']
        if normalized_vitals['spo2_percent'] is not None:
            features['spo2_percent'] = normalized_vitals['spo2_percent']
        
        # Process video if provided
        video_vital_signs = None
        if video_file and video_file.filename:
            print("🎥 Processing video file for additional vital signs...")
            try:
                # Import video processing function
                from .video_processing import extract_video_vital_signs
                
                # Save video file
                video_content = await video_file.read()
                video_path = os.path.join(session_dir, f"video_{video_file.filename}")
                with open(video_path, "wb") as f:
                    f.write(video_content)
                
                # Process video
                video_vital_signs = extract_video_vital_signs(video_path)
                print("✅ Video processing complete")
                
            except Exception as e:
                print(f"⚠️ Video processing failed: {str(e)}")
                video_vital_signs = None
        
        # Parse symptoms
        try:
            symptoms_parsed = json.loads(symptoms)
        except:
            symptoms_parsed = []
        
        # Create clinical notes
        clinical_notes = {
            'chief_complaint': chief_complaint,
            'symptoms': symptoms_parsed,
            'pain_scale': pain_scale,
            'symptom_duration': symptom_duration,
            'temperature': temperature,
            'staff_notes': staff_notes
        }
        
        # Create patient data for MAI-DxO
        patient_data = {
            'patient_id': patient.patient_id,
            'full_name': patient.full_name,
            'age': patient.age,
            'gender': patient.gender.value if patient.gender else 'unknown',
            'weight_kg': patient.weight_kg or 70,
            'height_cm': patient.height_cm or 170,
            'conditions': patient.known_conditions.split(', ') if patient.known_conditions else [],
            'medications': patient.current_medications.split(', ') if patient.current_medications else [],
            'allergies': patient.allergies.split(', ') if patient.allergies else [],
            'surgical_history': patient.previous_surgeries.split(', ') if patient.previous_surgeries else []
        }
        
        # Create complete patient data for MAI-DxO virtual medical panel
        complete_patient_data = {
            "personal_information": {
                "full_name": patient_data['full_name'],
                "age": patient_data['age'],
                "gender": patient_data['gender'],
                "phone_number": patient.phone if hasattr(patient, 'phone') else "N/A",
                "weight_kg": patient_data['weight_kg'],
                "height_cm": patient_data['height_cm']
            },
            "medical_history": {
                "known_conditions": patient_data['conditions'],
                "current_medications": patient_data['medications'],
                "allergies": patient_data['allergies'],
                "previous_surgeries": patient_data['surgical_history']
            },
            "vital_signs_data": {
                "ecg_analysis": {
                    "heart_rate_bpm": features.get('heart_rate', {}).get('mean', 0),
                    "rhythm_analysis": "sinus rhythm" if not features.get('heart_rate', {}).get('arrhythmia_risk', 'low') == 'moderate' else "irregular rhythm",
                    "hrv_metrics": features.get('heart_rate', {}).get('hrv_metrics', {}),
                    "confidence_score": 0.85
                },
                "video_vitals_analysis": {
                    "respiratory_rate_bpm": video_vital_signs.get('respiratory_analysis', {}).get('respiratory_rate_bpm', features.get('respiratory_rate', {}).get('mean', 0)) if video_vital_signs else features.get('respiratory_rate', {}).get('mean', 0),
                    "respiratory_confidence": video_vital_signs.get('respiratory_analysis', {}).get('confidence', 0) if video_vital_signs else 0,
                    "breathing_pattern": "normal" if video_vital_signs and video_vital_signs.get('respiratory_analysis', {}).get('status') == 'normal' else features.get('breathing_pattern', {}).get('pattern_classification', 'normal'),
                    "vitallens_data_available": video_vital_signs is not None and video_vital_signs.get('processing_metadata', {}).get('processing_successful', False),
                    "data_source": video_vital_signs.get('processing_metadata', {}).get('api_source', 'ECG') if video_vital_signs else 'ECG'
                },
                "vitallens_respiratory_data": {
                    "respiratory_analysis": video_vital_signs.get('respiratory_analysis', {}) if video_vital_signs else {},
                    "respiratory_waveform": video_vital_signs.get('respiratory_waveform', {}) if video_vital_signs else {},
                    "face_detection": video_vital_signs.get('face_detection', {}) if video_vital_signs else {},
                    "processing_metadata": video_vital_signs.get('processing_metadata', {}) if video_vital_signs else {}
                }
            },
            "symptoms_context": {
                "chief_complaint": chief_complaint,
                "duration_symptoms": symptom_duration,
                "additional_symptoms": symptoms_parsed,
                "pain_scale": pain_scale,
                "staff_observations": staff_notes
            },
            "recording_metadata": {
                "timestamp": datetime.now().isoformat(),
                "location": "Puskesmas",
                "staff_id": "health_worker_001",
                "equipment_calibrated": True
            }
        }
        
        print("🏥 Running MAI-DxO Virtual Medical Panel Analysis...")
        print("="*80)
        print("📋 PATIENT DATA FOR AI ANALYSIS:")
        print(f"   Name: {complete_patient_data['personal_information']['full_name']}")
        print(f"   Age: {complete_patient_data['personal_information']['age']}")
        print(f"   Gender: {complete_patient_data['personal_information']['gender']}")
        print(f"   Chief Complaint: {complete_patient_data['symptoms_context']['chief_complaint']}")
        print(f"   Symptoms: {complete_patient_data['symptoms_context']['additional_symptoms']}")
        print(f"   Pain Scale: {complete_patient_data['symptoms_context']['pain_scale']}")
        print(f"   Temperature: {temperature}°C")
        print(f"   Heart Rate: {complete_patient_data['vital_signs_data']['ecg_analysis']['heart_rate_bpm']} bpm")
        print(f"   Respiratory Rate: {complete_patient_data['vital_signs_data']['video_vitals_analysis']['respiratory_rate_bpm']} bpm")
        print(f"   Video Analysis Available: {complete_patient_data['vital_signs_data']['video_vitals_analysis']['vitallens_data_available']}")
        print("="*80)
        
        # Process through MAI-DxO virtual medical panel
        mai_dxo_result = process_patient_with_mai_dxo(complete_patient_data)
        
        print("\n" + "="*80)
        print("🎯 MAI-DxO ANALYSIS COMPLETE - EXTRACTING RESULTS")
        print("="*80)
        
        # Extract final consensus for database storage
        final_consensus = mai_dxo_result.get('final_consensus', {})
        
        # Determine AI risk level from consensus
        consensus_risk = final_consensus.get('analysis_summary', {}).get('overall_risk_level', 'medium')
        if consensus_risk == 'high':
            ai_risk_level = "HIGH"
        elif consensus_risk == 'medium':
            ai_risk_level = "MEDIUM"
        else:
            ai_risk_level = "LOW"
        
        print(f"✅ MAI-DxO Analysis Complete - Risk Level: {ai_risk_level}")
        print(f"📊 Final Consensus Risk: {consensus_risk}")
        print(f"🔍 Primary Concerns: {final_consensus.get('analysis_summary', {}).get('primary_concerns', [])}")
        print(f"💡 Key Recommendations: {final_consensus.get('analysis_summary', {}).get('key_recommendations', [])}")
        print(f"🔄 Debate Rounds: {len(mai_dxo_result.get('debate_history', []))}")
        print("="*80)
        
        # Store complete MAI-DxO result as the mai_dxo_data
        mai_dxo_data = mai_dxo_result
        
        # Map AI risk to health screening status
        if ai_risk_level == "HIGH":
            overall_status = "urgent"
        elif ai_risk_level == "MEDIUM":
            overall_status = "attention_needed"
        else:
            overall_status = "healthy"
        
        # Create analysis session record (store the actual paths used)
        analysis_session = AnalysisSession(
            session_id=session_id,
            patient_id=patient_id,
            health_worker_id=3,  # TODO: Use current_user.id when auth is re-enabled
            status=AnalysisStatus.COMPLETED,  # Set to COMPLETED so specialist can see it
            dat_file_path=dat_path,  # This now contains the correct path
            hea_file_path=hea_path,  # This now contains the correct path
            dat_normalized_file_path=dat_normalized_path,
            hea_normalized_file_path=hea_normalized_path,
            breath_annotation_file_path=breath_annotation_path,
            features=features,
            mai_dxo_data=mai_dxo_data,
            clinical_notes=clinical_notes,
            ai_risk_level=ai_risk_level,
            # Store extracted vital signs directly
            heart_rate_bpm=features.get('heart_rate_bpm'),
            respiratory_rate_bpm=features.get('respiratory_rate_bpm'),
            pulse_rate_bpm=features.get('pulse_rate_bpm'),
            spo2_percent=features.get('spo2_percent'),
            hrv_sdnn=features.get('heart_rate', {}).get('hrv_metrics', {}).get('SDNN') or features.get('hrv_sdnn'),
            hrv_rmssd=features.get('heart_rate', {}).get('hrv_metrics', {}).get('RMSSD') or features.get('hrv_rmssd'),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        db.add(analysis_session)
        db.commit()
        db.refresh(analysis_session)
        
        # Create health screening record for specialist portal
        # This is needed because the specialist portal looks for data in health_screenings table
        try:
            # Get patient's internal ID
            patient_internal_id = patient.id
            
            # Create health screening record using raw SQL
            health_screening_query = text("""
                INSERT INTO health_screenings (
                    patient_id, health_center_id, health_worker_id, screening_date, 
                    status, overall_status, overall_notes
                ) VALUES (
                    :patient_id, :health_center_id, :health_worker_id, :screening_date,
                    :status, :overall_status, :overall_notes
                )
            """)
            
            db.execute(health_screening_query, {
                'patient_id': patient_internal_id,
                'health_center_id': patient.registered_at_health_center_id or 1,
                'health_worker_id': 3,  # TODO: Use current_user.id when auth is re-enabled
                'screening_date': datetime.now(),
                'status': 'completed',
                'overall_status': overall_status,
                'overall_notes': f"{chief_complaint}. Symptoms: {', '.join(symptoms_parsed) if symptoms_parsed else 'None'}. AI Risk: {ai_risk_level}. Primary Concerns: {', '.join(final_consensus.get('analysis_summary', {}).get('primary_concerns', []))}"
            })
            
            db.commit()
            
        except Exception as e:
            print(f"Warning: Failed to create health screening record: {str(e)}")
            # Don't fail the whole upload if this fails
        
        # Save MAI-DxO data to file for processing
        mai_dxo_path = os.path.join(session_dir, f"{session_id}_mai_dxo.json")
        with open(mai_dxo_path, "w") as f:
            json.dump(mai_dxo_data, f, indent=2)
        
        return JSONResponse(content={
            "success": True,
            "message": "Files uploaded and processed successfully - MAI-DxO Virtual Medical Panel Analysis Complete",
            "session_id": session_id,
            "ai_risk_level": ai_risk_level,
            "features": features,
            "mai_dxo_analysis": {
                "consensus": final_consensus,
                "debate_rounds": len(mai_dxo_result.get('debate_history', [])),
                "panel_metadata": mai_dxo_result.get('panel_metadata', {})
            },
            "status": "completed"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}") 