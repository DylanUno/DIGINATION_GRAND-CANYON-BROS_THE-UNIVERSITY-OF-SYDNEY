"""
Video Processing Router for VitalSense Pro
Handles video upload, processing, and vital signs extraction
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import os
import shutil
import uuid
from datetime import datetime
from typing import Optional
import json

from dotenv import load_dotenv
from database import get_db
from models.patient import Patient
from utils.auth import get_current_user

load_dotenv()
router = APIRouter()

# Video upload constants
VIDEO_UPLOAD_DIR = "uploads/videos"
MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100MB for video files
ALLOWED_VIDEO_EXTENSIONS = {'.mp4', '.avi', '.mov', '.mkv', '.webm'}

# Create video upload directory if it doesn't exist
os.makedirs(VIDEO_UPLOAD_DIR, exist_ok=True)

def extract_video_vital_signs(video_path: str) -> dict:
    """
    Extract respiratory rate and respiratory waveform from video using VitalLens API
    """
    try:
        import subprocess
        import base64
        import requests
        import os
        
        # VitalLens API configuration
        VITALLENS_API_KEY = os.getenv("VITALLENS_API_KEY")
        if not VITALLENS_API_KEY:
            raise Exception("VITALLENS_API_KEY not found in environment variables")
        API_URL = "https://api.rouast.com/vitallens-v3/file"
        
        print(f"\n" + "="*80)
        print("🎥 VITALLENS API PROCESSING")
        print("="*80)
        print(f"📁 Video file: {video_path}")
        print(f"🔑 API Key: {VITALLENS_API_KEY[:10]}...")
        print(f"🌐 API URL: {API_URL}")
        
        # Check if video file exists
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video file not found: {video_path}")
        
        print(f"✅ Video file exists: {os.path.getsize(video_path)} bytes")
        
        # Get video fps using ffprobe
        try:
            fps_cmd = [
                "ffprobe", "-v", "error", "-select_streams", "v:0", 
                "-show_entries", "stream=r_frame_rate", "-of", 
                "default=nw=1:nk=1", video_path
            ]
            fps_output = subprocess.check_output(fps_cmd).decode().strip()
            
            # Handle fractional fps (e.g., "30000/1001")
            if '/' in fps_output:
                num, den = fps_output.split('/')
                fps = float(num) / float(den)
            else:
                fps = float(fps_output)
            
            print(f"✅ Video FPS detected: {fps}")
            
        except Exception as e:
            print(f"⚠️ Could not detect FPS, using default 30: {e}")
            fps = 30.0
        
        # Convert video to the format required by VitalLens API
        # VitalLens expects 40x40 pixel RGB24 format
        # Limit to 30 seconds max to stay under 10MB API limit
        try:
            print(f"🔄 Converting video for VitalLens API...")
            print(f"   - Target format: 40x40 RGB24")
            print(f"   - Duration limit: 30 seconds")
            print(f"   - Size limit: 10MB")
            
            ffmpeg_cmd = [
                "ffmpeg", "-i", video_path, 
                "-t", "30",                # Limit to 30 seconds
                "-vf", "scale=40:40",      # Resize to 40x40 as required by VitalLens
                "-pix_fmt", "rgb24",       # RGB24 pixel format
                "-f", "rawvideo",          # Raw video output
                "-"                        # Output to stdout
            ]
            
            video_data = subprocess.check_output(ffmpeg_cmd, stderr=subprocess.DEVNULL)
            
            # Check if video is still too large (VitalLens has 10MB limit)
            if len(video_data) > 8 * 1024 * 1024:  # 8MB safety margin
                print(f"⚠️ Video too large ({len(video_data)} bytes), reducing to 20 seconds...")
                ffmpeg_cmd = [
                    "ffmpeg", "-i", video_path, 
                    "-t", "20",                # Reduce to 20 seconds
                    "-vf", "scale=40:40",      # Resize to 40x40 as required by VitalLens
                    "-pix_fmt", "rgb24",       # RGB24 pixel format
                    "-f", "rawvideo",          # Raw video output
                    "-"                        # Output to stdout
                ]
                video_data = subprocess.check_output(ffmpeg_cmd, stderr=subprocess.DEVNULL)
            
            video_b64 = base64.b64encode(video_data).decode()
            
            print(f"✅ Video converted successfully!")
            print(f"   - Raw video size: {len(video_data)} bytes")
            print(f"   - Base64 size: {len(video_b64)} characters")
            print(f"   - Estimated duration: {len(video_data) / (40 * 40 * 3 * fps):.1f} seconds")
            
        except subprocess.CalledProcessError as e:
            raise Exception(f"FFmpeg conversion failed: {e}")
        except Exception as e:
            raise Exception(f"Video conversion error: {e}")
        
        # Prepare API request payload
        payload = {
            "video": video_b64,
            "fps": str(fps)
        }
        
        headers = {
            "x-api-key": VITALLENS_API_KEY,
            "Content-Type": "application/json"
        }
        
        print(f"\n🌐 Sending request to VitalLens API...")
        print(f"   - Payload size: {len(str(payload))} characters")
        print(f"   - Headers: {list(headers.keys())}")
        
        # Make API request with timeout
        try:
            response = requests.post(
                API_URL,
                headers=headers,
                json=payload,
                timeout=60  # 60 second timeout
            )
            
            print(f"📡 VitalLens API response received!")
            print(f"   - Status code: {response.status_code}")
            print(f"   - Response size: {len(response.content)} bytes")
            print(f"   - Response headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                vitallens_result = response.json()
                print(f"✅ VitalLens API processing successful!")
                print(f"   - Response type: {type(vitallens_result)}")
                print(f"   - Response structure: {list(vitallens_result.keys()) if isinstance(vitallens_result, dict) else f'List with {len(vitallens_result)} items'}")
                
                # Save raw response to file for inspection
                try:
                    import json
                    with open('vitallens_raw_response.json', 'w') as f:
                        json.dump(vitallens_result, f, indent=2)
                    print(f"   💾 Raw VitalLens response saved to: vitallens_raw_response.json")
                except Exception as e:
                    print(f"   ⚠️ Could not save raw response: {e}")
                
                # Print a preview of the response
                if isinstance(vitallens_result, list) and len(vitallens_result) > 0:
                    first_result = vitallens_result[0]
                    print(f"   - First result keys: {list(first_result.keys()) if isinstance(first_result, dict) else 'Not a dict'}")
                    if isinstance(first_result, dict) and 'vital_signs' in first_result:
                        vital_signs = first_result['vital_signs']
                        print(f"   - Vital signs available: {list(vital_signs.keys())}")
                        if 'respiratory_rate' in vital_signs:
                            rr = vital_signs['respiratory_rate']
                            print(f"   - Respiratory rate: {rr.get('value', 'N/A')} {rr.get('unit', '')} (confidence: {rr.get('confidence', 'N/A')}%)")
                elif isinstance(vitallens_result, dict):
                    print(f"   - Response keys: {list(vitallens_result.keys())}")
                    if 'vital_signs' in vitallens_result:
                        vital_signs = vitallens_result['vital_signs']
                        print(f"   - Vital signs available: {list(vital_signs.keys())}")
                        if 'respiratory_rate' in vital_signs:
                            rr = vital_signs['respiratory_rate']
                            print(f"   - Respiratory rate: {rr.get('value', 'N/A')} {rr.get('unit', '')} (confidence: {rr.get('confidence', 'N/A')}%)")
                
                # Extract respiratory data from VitalLens response
                processed_result = process_vitallens_response(vitallens_result, fps)
                
                print("="*80)
                return processed_result
                
            else:
                error_detail = f"VitalLens API error {response.status_code}: {response.text}"
                print(f"❌ {error_detail}")
                print(f"   - Error response: {response.text[:500]}...")
                
                # Return fallback data on API error
                return create_fallback_respiratory_data()
                
        except requests.exceptions.Timeout:
            print("⏰ VitalLens API request timed out")
            print("   - Request exceeded 60 second timeout")
            return create_fallback_respiratory_data()
            
        except requests.exceptions.RequestException as e:
            print(f"🌐 VitalLens API request failed: {e}")
            print(f"   - Exception type: {type(e).__name__}")
            return create_fallback_respiratory_data()
        
    except Exception as e:
        print(f"❌ Video processing error: {str(e)}")
        print(f"   - Exception type: {type(e).__name__}")
        print("="*80)
        return create_fallback_respiratory_data()

def process_vitallens_response(vitallens_result: dict, fps: float) -> dict:
    """
    Process VitalLens API response and extract respiratory data
    """
    print(f"\n🔍 PROCESSING VITALLENS RESPONSE")
    print(f"   - Input FPS: {fps}")
    print(f"   - Response type: {type(vitallens_result)}")
    
    try:
        # Initialize result structure
        result = {
            "processing_metadata": {
                "api_source": "VitalLens",
                "fps": fps,
                "processing_successful": True
            },
            "respiratory_analysis": {},
            "respiratory_waveform": {}
        }
        
        # Check if we have valid results
        if not vitallens_result or len(vitallens_result) == 0:
            print("⚠️ No results from VitalLens API")
            return create_fallback_respiratory_data()
        
        print(f"   - Response has {len(vitallens_result)} items")
        
        # Get the first face result (assuming single person)
        face_result = vitallens_result[0] if isinstance(vitallens_result, list) else vitallens_result
        print(f"   - Processing face result: {list(face_result.keys()) if isinstance(face_result, dict) else 'Not a dict'}")
        
        # Extract vital signs
        vital_signs = face_result.get('vital_signs', {})
        print(f"   - Vital signs available: {list(vital_signs.keys())}")
        
        # Process respiratory rate
        if 'respiratory_rate' in vital_signs:
            rr_data = vital_signs['respiratory_rate']
            print(f"   ✅ Respiratory rate found: {rr_data}")
            
            result["respiratory_analysis"] = {
                "respiratory_rate_bpm": rr_data.get('value', 0),
                "unit": rr_data.get('unit', 'breaths/min'),
                "confidence": rr_data.get('confidence', 0),
                "status": "normal" if 12 <= rr_data.get('value', 0) <= 20 else "abnormal",
                "note": rr_data.get('note', 'Respiratory rate extracted from video')
            }
            print(f"✅ Respiratory rate extracted: {rr_data.get('value')} breaths/min (confidence: {rr_data.get('confidence')}%)")
        else:
            print("⚠️ No respiratory rate in VitalLens response")
            result["respiratory_analysis"] = {
                "respiratory_rate_bpm": 0,
                "unit": "breaths/min",
                "confidence": 0,
                "status": "unknown",
                "note": "No respiratory rate data available"
            }
        
        # Process respiratory waveform
        if 'respiratory_waveform' in vital_signs:
            waveform_data = vital_signs['respiratory_waveform']
            print(f"   ✅ Respiratory waveform found: {list(waveform_data.keys()) if isinstance(waveform_data, dict) else 'Not a dict'}")
            
            result["respiratory_waveform"] = {
                "waveform_data": waveform_data,
                "sampling_rate": fps,
                "duration_seconds": len(waveform_data) / fps if isinstance(waveform_data, list) else 0,
                "note": "Respiratory waveform extracted from video"
            }
        else:
            print("⚠️ No respiratory waveform in VitalLens response")
            result["respiratory_waveform"] = {
                "waveform_data": [],
                "sampling_rate": fps,
                "duration_seconds": 0,
                "note": "No respiratory waveform data available"
            }
        
        # Add face detection info if available
        if 'face_detection' in face_result:
            face_data = face_result['face_detection']
            print(f"   ✅ Face detection info: {list(face_data.keys()) if isinstance(face_data, dict) else 'Not a dict'}")
            result["face_detection"] = face_data
        else:
            print("⚠️ No face detection info in VitalLens response")
            result["face_detection"] = {"status": "no_data"}
        
        print(f"✅ VitalLens response processing completed successfully")
        print(f"   - Final result keys: {list(result.keys())}")
        
        return result
        
    except Exception as e:
        print(f"❌ Error processing VitalLens response: {e}")
        print(f"   - Exception type: {type(e).__name__}")
        return create_fallback_respiratory_data()

def create_fallback_respiratory_data() -> dict:
    """
    Create fallback respiratory data when VitalLens API is unavailable
    """
    return {
        "processing_metadata": {
            "api_source": "Fallback",
            "processing_successful": False,
            "note": "VitalLens API unavailable, using fallback data"
        },
        "respiratory_analysis": {
            "respiratory_rate_bpm": 16,
            "unit": "breaths/min",
            "confidence": 0,
            "status": "estimated",
            "note": "Fallback respiratory rate - VitalLens API unavailable"
        },
        "respiratory_waveform": {
            "waveform_data": [],
            "unit": "normalized",
            "confidence_per_frame": [],
            "sampling_rate": 30,
            "duration_seconds": 0,
            "note": "Respiratory waveform unavailable - VitalLens API error"
        },
        "face_detection": {
            "faces_detected": False,
            "average_confidence": 0,
            "note": "Face detection unavailable"
        }
    }

@router.post("/upload-video")
async def upload_video(
    patient_id: str = Form(...),
    video_file: UploadFile = File(...),
    db: Session = Depends(get_db)
    # TODO: Re-enable authentication: current_user: dict = Depends(get_current_user)
):
    """Upload and process video file for vital signs analysis"""
    
    try:
        # Validate file extension
        file_extension = os.path.splitext(video_file.filename)[1].lower()
        if file_extension not in ALLOWED_VIDEO_EXTENSIONS:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid video format. Allowed formats: {', '.join(ALLOWED_VIDEO_EXTENSIONS)}"
            )
        
        # Check file size
        video_content = await video_file.read()
        if len(video_content) > MAX_VIDEO_SIZE:
            raise HTTPException(status_code=400, detail="Video file too large (max 100MB)")
        
        # Get patient data
        patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        # Create unique session ID
        session_id = str(uuid.uuid4())
        
        # Create session directory
        session_dir = os.path.join(VIDEO_UPLOAD_DIR, session_id)
        os.makedirs(session_dir, exist_ok=True)
        
        # Save video file
        video_path = os.path.join(session_dir, f"{session_id}_{video_file.filename}")
        
        with open(video_path, "wb") as f:
            f.write(video_content)
        
        print(f"DEBUG: Video file saved to: {video_path}")
        
        # Process video for vital signs
        print("🎥 Processing video for vital signs extraction...")
        video_vital_signs = extract_video_vital_signs(video_path)
        
        # Save processing results
        results_path = os.path.join(session_dir, f"{session_id}_results.json")
        with open(results_path, "w") as f:
            json.dump(video_vital_signs, f, indent=2)
        
        print("✅ Video processing complete")
        
        return JSONResponse(content={
            "success": True,
            "message": "Video uploaded and processed successfully",
            "session_id": session_id,
            "video_vital_signs": video_vital_signs,
            "processing_metadata": {
                "video_file": video_file.filename,
                "file_size_mb": round(len(video_content) / (1024 * 1024), 2),
                "processing_time": datetime.now().isoformat()
            }
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video upload failed: {str(e)}")

@router.get("/video-session/{session_id}")
async def get_video_session(session_id: str, db: Session = Depends(get_db)):
    """Get video processing session results"""
    
    try:
        session_dir = os.path.join(VIDEO_UPLOAD_DIR, session_id)
        results_path = os.path.join(session_dir, f"{session_id}_results.json")
        
        if not os.path.exists(results_path):
            raise HTTPException(status_code=404, detail="Video session not found")
        
        with open(results_path, "r") as f:
            video_results = json.load(f)
        
        return JSONResponse(content={
            "success": True,
            "session_id": session_id,
            "video_vital_signs": video_results,
            "status": "completed"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get video session: {str(e)}")

@router.delete("/video-session/{session_id}")
async def delete_video_session(session_id: str, db: Session = Depends(get_db)):
    """Delete video processing session and files"""
    
    try:
        session_dir = os.path.join(VIDEO_UPLOAD_DIR, session_id)
        
        if os.path.exists(session_dir):
            shutil.rmtree(session_dir)
            
        return JSONResponse(content={
            "success": True,
            "message": "Video session deleted successfully"
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete video session: {str(e)}") 