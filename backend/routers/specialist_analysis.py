"""
Specialist Analysis Router
API endpoints for specialists to access patient analysis data
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
import json

from database import get_db
from models.analysis_session import AnalysisSession
from models.patient import Patient
from models.user import User
from utils.auth import get_current_user

router = APIRouter()

@router.get("/patient-analysis/{patient_id}")
async def get_patient_analysis(
    patient_id: str,
    db: Session = Depends(get_db)
    # TODO: Re-enable authentication when needed
    # current_user: dict = Depends(get_current_user)
):
    """
    Get patient analysis data for specialist review
    Returns complete analysis including MAI-DxO results
    """
    try:
        # Get the most recent analysis session for this patient
        analysis_session = db.query(AnalysisSession).filter(
            AnalysisSession.patient_id == patient_id
        ).order_by(AnalysisSession.created_at.desc()).first()
        
        if not analysis_session:
            raise HTTPException(
                status_code=404,
                detail=f"No analysis session found for patient {patient_id}"
            )
        
        # Get patient information
        patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
        if not patient:
            raise HTTPException(
                status_code=404,
                detail=f"Patient {patient_id} not found"
            )
        
        # Parse MAI-DxO data if available
        mai_dxo_data = {}
        if analysis_session.mai_dxo_data:
            try:
                mai_dxo_data = json.loads(analysis_session.mai_dxo_data) if isinstance(analysis_session.mai_dxo_data, str) else analysis_session.mai_dxo_data
            except json.JSONDecodeError:
                mai_dxo_data = {"error": "Failed to parse MAI-DxO data"}
        
        # Parse features data if available
        features_data = {}
        if analysis_session.features:
            try:
                features_data = json.loads(analysis_session.features) if isinstance(analysis_session.features, str) else analysis_session.features
            except json.JSONDecodeError:
                features_data = {"error": "Failed to parse features data"}
        
        # Parse clinical notes if available
        clinical_notes = {}
        if analysis_session.clinical_notes:
            try:
                clinical_notes = json.loads(analysis_session.clinical_notes) if isinstance(analysis_session.clinical_notes, str) else analysis_session.clinical_notes
            except json.JSONDecodeError:
                clinical_notes = {"error": "Failed to parse clinical notes"}
        
        # Prepare response data
        response_data = {
            "patient_info": {
                "patient_id": patient.patient_id,
                "full_name": patient.full_name,
                "age": patient.age,
                "gender": patient.gender,
                "phone": patient.phone,
                "address": patient.address,
                "known_conditions": patient.known_conditions or [],
                "current_medications": patient.current_medications or [],
                "allergies": patient.allergies or []
            },
            "analysis_session": {
                "session_id": analysis_session.session_id,
                "status": analysis_session.status.value if analysis_session.status else "unknown",
                "ai_risk_level": analysis_session.ai_risk_level.value if analysis_session.ai_risk_level else "unknown",
                "created_at": analysis_session.created_at.isoformat() if analysis_session.created_at else None,
                "updated_at": analysis_session.updated_at.isoformat() if analysis_session.updated_at else None
            },
            "clinical_context": {
                "chief_complaint": clinical_notes.get("chief_complaint", ""),
                "symptoms": clinical_notes.get("symptoms", []),
                "pain_scale": clinical_notes.get("pain_scale", 0),
                "symptom_duration": clinical_notes.get("symptom_duration", ""),
                "temperature": clinical_notes.get("temperature", ""),
                "staff_notes": clinical_notes.get("staff_notes", "")
            },
            "vital_signs": {
                "heart_rate_bpm": analysis_session.heart_rate_bpm,
                "respiratory_rate_bpm": analysis_session.respiratory_rate_bpm,
                "pulse_rate_bpm": analysis_session.pulse_rate_bpm,
                "spo2_percent": analysis_session.spo2_percent,
                "hrv_sdnn": analysis_session.hrv_sdnn,
                "hrv_rmssd": analysis_session.hrv_rmssd,
                "video_respiratory_rate": analysis_session.video_respiratory_rate,
                "video_analysis_confidence": analysis_session.video_analysis_confidence
            },
            "features": features_data,
            "mai_dxo_results": mai_dxo_data,
            "files": {
                "dat_file_path": analysis_session.dat_file_path,
                "hea_file_path": analysis_session.hea_file_path,
                "video_file_path": analysis_session.video_file_path
            }
        }
        
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching patient analysis: {str(e)}"
        )

@router.get("/mai-dxo-summary/{patient_id}")
async def get_mai_dxo_summary(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a simplified MAI-DxO analysis summary for quick review
    """
    try:
        # Get the most recent analysis session for this patient
        analysis_session = db.query(AnalysisSession).filter(
            AnalysisSession.patient_id == patient_id
        ).order_by(AnalysisSession.created_at.desc()).first()
        
        if not analysis_session or not analysis_session.mai_dxo_data:
            return {"error": "No MAI-DxO data available for this patient"}
        
        # Parse MAI-DxO data
        mai_dxo_data = json.loads(analysis_session.mai_dxo_data) if isinstance(analysis_session.mai_dxo_data, str) else analysis_session.mai_dxo_data
        
        # Extract key information from MAI-DxO results
        final_consensus = mai_dxo_data.get("final_consensus", {})
        debate_history = mai_dxo_data.get("debate_history", [])
        
        # Get specialist responses from the most recent round
        specialist_responses = {}
        if debate_history:
            latest_round = debate_history[-1]
            specialist_responses = latest_round.get("specialist_responses", {})
        
        summary = {
            "overall_risk_level": final_consensus.get("analysis_summary", {}).get("overall_risk_level", "unknown"),
            "consensus_level": mai_dxo_data.get("panel_metadata", {}).get("final_consensus_level", 0),
            "total_rounds": mai_dxo_data.get("panel_metadata", {}).get("total_rounds", 0),
            "timestamp": mai_dxo_data.get("panel_metadata", {}).get("timestamp", ""),
            "specialist_insights": [],
            "key_recommendations": final_consensus.get("analysis_summary", {}).get("key_recommendations", []),
            "follow_up_needed": final_consensus.get("analysis_summary", {}).get("follow_up_needed", False)
        }
        
        # Extract key insights from each specialist
        for specialist_name, response in specialist_responses.items():
            if isinstance(response, dict):
                summary["specialist_insights"].append({
                    "specialist": specialist_name,
                    "role": response.get("role", ""),
                    "key_finding": response.get("analysis", {}).get("primary_concern", "No primary concern identified"),
                    "confidence": response.get("analysis", {}).get("confidence_level", 0)
                })
        
        return summary
        
    except Exception as e:
        return {"error": f"Error parsing MAI-DxO data: {str(e)}"} 