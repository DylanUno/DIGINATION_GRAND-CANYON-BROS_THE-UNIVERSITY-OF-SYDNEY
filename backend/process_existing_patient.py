#!/usr/bin/env python3
"""
Script to run MAI-DxO analysis for existing patients
This will process patients that are stuck in PROCESSING status
"""

import os
import sys
import json
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_db
from models.analysis_session import AnalysisSession, AnalysisStatus
from models.patient import Patient
from mai_dxo_pipeline import process_patient_with_mai_dxo

def process_patient_analysis(patient_id: str):
    """Process MAI-DxO analysis for a specific patient"""
    
    print(f"\n🔍 Processing patient: {patient_id}")
    
    # Get database session
    db = next(get_db())
    
    try:
        # Get the analysis session
        analysis_session = db.query(AnalysisSession).filter(
            AnalysisSession.patient_id == patient_id
        ).order_by(AnalysisSession.created_at.desc()).first()
        
        if not analysis_session:
            print(f"❌ No analysis session found for patient {patient_id}")
            return False
        
        # Get patient information
        patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
        if not patient:
            print(f"❌ Patient {patient_id} not found")
            return False
        
        print(f"📋 Found analysis session: {analysis_session.session_id}")
        print(f"📊 Current status: {analysis_session.status}")
        
        # Check if we have the required data
        if not analysis_session.mai_dxo_data:
            print("❌ No MAI-DxO data found in analysis session")
            return False
        
        # Parse clinical notes
        clinical_notes = analysis_session.clinical_notes or {}
        if isinstance(clinical_notes, str):
            clinical_notes = json.loads(clinical_notes)
        
        # Parse features
        features = analysis_session.features or {}
        if isinstance(features, str):
            features = json.loads(features)
        
        # Build complete patient data for MAI-DxO analysis
        complete_patient_data = {
                         "personal_information": {
                 "full_name": patient.full_name,
                 "age": patient.age,
                 "gender": str(patient.gender).lower() if patient.gender else "male",
                 "phone_number": patient.phone or "N/A",
                 "weight_kg": 70,  # Default values
                 "height_cm": 170
             },
            "medical_history": {
                "known_conditions": patient.known_conditions or [],
                "current_medications": patient.current_medications or [],
                "allergies": patient.allergies or [],
                "previous_surgeries": []
            },
            "vital_signs_data": {
                "ecg_analysis": {
                    "heart_rate_bpm": features.get('heart_rate', {}).get('mean', 75),
                    "rhythm_analysis": "sinus rhythm",
                    "hrv_metrics": features.get('heart_rate', {}).get('hrv_metrics', {}),
                    "confidence_score": 0.85
                },
                "video_vitals_analysis": {
                    "respiratory_rate_bpm": features.get('respiratory_rate', {}).get('mean', 18),
                    "respiratory_confidence": 0.88,
                    "breathing_pattern": features.get('breathing_pattern', {}).get('pattern_classification', 'normal'),
                    "vitallens_data_available": True,
                    "data_source": "ECG"
                },
                "vitallens_respiratory_data": {
                    "respiratory_analysis": features.get('respiratory_rate', {}),
                    "respiratory_waveform": features.get('respiratory_waveform', {}),
                    "face_detection": {},
                    "processing_metadata": {"processing_successful": True}
                }
            },
            "symptoms_context": {
                "chief_complaint": clinical_notes.get('chief_complaint', 'Chest pain'),
                "duration_symptoms": clinical_notes.get('symptom_duration', '2 hours'),
                "additional_symptoms": clinical_notes.get('symptoms', []),
                "pain_scale": clinical_notes.get('pain_scale', 5),
                "staff_observations": clinical_notes.get('staff_notes', '')
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
        print(f"   Heart Rate: {complete_patient_data['vital_signs_data']['ecg_analysis']['heart_rate_bpm']} bpm")
        print(f"   Respiratory Rate: {complete_patient_data['vital_signs_data']['video_vitals_analysis']['respiratory_rate_bpm']} bpm")
        print("="*80)
        
        # Process through MAI-DxO virtual medical panel
        mai_dxo_result = process_patient_with_mai_dxo(complete_patient_data)
        
        print("\n" + "="*80)
        print("🎯 MAI-DxO ANALYSIS COMPLETE - UPDATING DATABASE")
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
        
        # Update the analysis session with the complete MAI-DxO result
        analysis_session.mai_dxo_data = mai_dxo_result
        analysis_session.ai_risk_level = ai_risk_level
        analysis_session.status = AnalysisStatus.COMPLETED
        analysis_session.updated_at = datetime.now()
        analysis_session.ai_analysis_completed_at = datetime.now()
        
        # Extract vital signs from features for database fields
        if features.get('heart_rate'):
            analysis_session.heart_rate_bpm = features['heart_rate'].get('mean')
        if features.get('respiratory_rate'):
            analysis_session.respiratory_rate_bpm = features['respiratory_rate'].get('mean')
        if features.get('spo2'):
            analysis_session.spo2_percent = features['spo2'].get('mean', 0) * 100  # Convert to percentage
        if features.get('heart_rate', {}).get('hrv_metrics'):
            analysis_session.hrv_sdnn = features['heart_rate']['hrv_metrics'].get('sdnn')
            analysis_session.hrv_rmssd = features['heart_rate']['hrv_metrics'].get('rmssd')
        
        # Commit changes
        db.commit()
        db.refresh(analysis_session)
        
        print("✅ Database updated successfully!")
        print(f"📝 Session status: {analysis_session.status}")
        print(f"⚠️ AI Risk Level: {analysis_session.ai_risk_level}")
        print("="*80)
        
        return True
        
    except Exception as e:
        print(f"❌ Error processing patient {patient_id}: {str(e)}")
        db.rollback()
        return False
    finally:
        db.close()

def main():
    """Main function to process patients"""
    print("🚀 MAI-DxO Analysis Processor")
    print("="*50)
    
    # Process the specific patient
    patient_id = "PT85843133"
    success = process_patient_analysis(patient_id)
    
    if success:
        print(f"\n🎉 Successfully processed patient {patient_id}")
        print("🌐 You can now view the analysis in the specialist portal!")
    else:
        print(f"\n❌ Failed to process patient {patient_id}")
    
    print("\n" + "="*50)

if __name__ == "__main__":
    main() 