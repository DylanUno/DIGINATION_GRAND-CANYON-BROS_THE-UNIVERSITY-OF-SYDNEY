"""
Plot API Router
Serve medical plots for specialist portal
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
import os
from typing import Dict, Optional

from database import get_db
from models.analysis_session import AnalysisSession
from services.plot_generation import plot_generator
from utils.auth import get_current_user

router = APIRouter()

@router.get("/patient-plots/{patient_id}")
async def get_patient_plots(
    patient_id: str,
    db: Session = Depends(get_db)
    # TODO: Re-enable authentication: current_user: dict = Depends(get_current_user)
):
    """Get all available plots for a patient"""
    
    try:
        # Get the most recent analysis session for this patient
        analysis_session = db.query(AnalysisSession).filter(
            AnalysisSession.patient_id == patient_id
        ).order_by(AnalysisSession.created_at.desc()).first()
        
        if not analysis_session:
            raise HTTPException(status_code=404, detail="No analysis session found for this patient")
        
        # Check if files exist
        files_exist = {
            'dat_file': analysis_session.dat_file_path and os.path.exists(analysis_session.dat_file_path),
            'hea_file': analysis_session.hea_file_path and os.path.exists(analysis_session.hea_file_path),
            'dat_normalized_file': analysis_session.dat_normalized_file_path and os.path.exists(analysis_session.dat_normalized_file_path),
            'hea_normalized_file': analysis_session.hea_normalized_file_path and os.path.exists(analysis_session.hea_normalized_file_path),
            'breath_annotation_file': analysis_session.breath_annotation_file_path and os.path.exists(analysis_session.breath_annotation_file_path)
        }
        
        print(f"DEBUG: File existence check for patient {patient_id}:")
        for file_type, exists in files_exist.items():
            file_path = getattr(analysis_session, f"{file_type}_path", None)
            print(f"  {file_type}: {exists} (path: {file_path})")
        
        # Generate plots
        plots = {}
        
        # ECG Waveform Plot
        if files_exist['dat_file'] and files_exist['hea_file']:
            try:
                plots['ecg_waveform'] = plot_generator.generate_ecg_waveform_plot(
                    analysis_session.dat_file_path,
                    analysis_session.hea_file_path
                )
                print("✅ ECG waveform plot generated successfully")
            except Exception as e:
                print(f"❌ Error generating ECG waveform plot: {str(e)}")
                plots['ecg_waveform'] = None
        
        # Vital Signs Trend Plot
        if files_exist['dat_normalized_file'] and files_exist['hea_normalized_file']:
            try:
                plots['vital_signs_trend'] = plot_generator.generate_vital_signs_trend_plot(
                    analysis_session.dat_normalized_file_path,
                    analysis_session.hea_normalized_file_path
                )
                print("✅ Vital signs trend plot generated successfully")
            except Exception as e:
                print(f"❌ Error generating vital signs trend plot: {str(e)}")
                plots['vital_signs_trend'] = None
        
        # Respiratory Pattern Plot
        if files_exist['dat_file'] and files_exist['hea_file'] and files_exist['breath_annotation_file']:
            try:
                plots['respiratory_pattern'] = plot_generator.generate_respiratory_pattern_plot(
                    analysis_session.dat_file_path,
                    analysis_session.hea_file_path,
                    analysis_session.breath_annotation_file_path
                )
                print("✅ Respiratory pattern plot generated successfully")
            except Exception as e:
                print(f"❌ Error generating respiratory pattern plot: {str(e)}")
                plots['respiratory_pattern'] = None
        
        # HRV Analysis Plot
        if files_exist['dat_file'] and files_exist['hea_file']:
            try:
                plots['hrv_analysis'] = plot_generator.generate_hrv_analysis_plot(
                    analysis_session.dat_file_path,
                    analysis_session.hea_file_path
                )
                print("✅ HRV analysis plot generated successfully")
            except Exception as e:
                print(f"❌ Error generating HRV analysis plot: {str(e)}")
                plots['hrv_analysis'] = None
        
        # Combined Dashboard Plot
        if (files_exist['dat_file'] and files_exist['hea_file'] and 
            files_exist['dat_normalized_file'] and files_exist['hea_normalized_file']):
            try:
                plots['combined_dashboard'] = plot_generator.generate_combined_dashboard_plot(
                    analysis_session.dat_file_path,
                    analysis_session.hea_file_path,
                    analysis_session.dat_normalized_file_path,
                    analysis_session.hea_normalized_file_path
                )
                print("✅ Combined dashboard plot generated successfully")
            except Exception as e:
                print(f"❌ Error generating combined dashboard plot: {str(e)}")
                plots['combined_dashboard'] = None
        
        # Filter out None values
        plots = {k: v for k, v in plots.items() if v is not None}
        
        return JSONResponse(content={
            "success": True,
            "patient_id": patient_id,
            "session_id": analysis_session.session_id,
            "plots": plots,
            "files_available": files_exist,
            "plots_generated": len(plots),
            "message": f"Generated {len(plots)} plots for patient {patient_id}"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating plots for patient {patient_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate plots: {str(e)}")

@router.get("/plot/{plot_type}/{patient_id}")
async def get_single_plot(
    plot_type: str,
    patient_id: str,
    db: Session = Depends(get_db)
    # TODO: Re-enable authentication: current_user: dict = Depends(get_current_user)
):
    """Get a specific plot type for a patient"""
    
    try:
        # Get the most recent analysis session for this patient
        analysis_session = db.query(AnalysisSession).filter(
            AnalysisSession.patient_id == patient_id
        ).order_by(AnalysisSession.created_at.desc()).first()
        
        if not analysis_session:
            raise HTTPException(status_code=404, detail="No analysis session found for this patient")
        
        # Generate the requested plot
        plot_data = None
        
        if plot_type == "ecg_waveform":
            if analysis_session.dat_file_path and analysis_session.hea_file_path:
                plot_data = plot_generator.generate_ecg_waveform_plot(
                    analysis_session.dat_file_path,
                    analysis_session.hea_file_path
                )
        
        elif plot_type == "vital_signs_trend":
            if analysis_session.dat_normalized_file_path and analysis_session.hea_normalized_file_path:
                plot_data = plot_generator.generate_vital_signs_trend_plot(
                    analysis_session.dat_normalized_file_path,
                    analysis_session.hea_normalized_file_path
                )
        
        elif plot_type == "respiratory_pattern":
            if (analysis_session.dat_file_path and analysis_session.hea_file_path and 
                analysis_session.breath_annotation_file_path):
                plot_data = plot_generator.generate_respiratory_pattern_plot(
                    analysis_session.dat_file_path,
                    analysis_session.hea_file_path,
                    analysis_session.breath_annotation_file_path
                )
        
        elif plot_type == "hrv_analysis":
            if analysis_session.dat_file_path and analysis_session.hea_file_path:
                plot_data = plot_generator.generate_hrv_analysis_plot(
                    analysis_session.dat_file_path,
                    analysis_session.hea_file_path
                )
        
        elif plot_type == "combined_dashboard":
            if (analysis_session.dat_file_path and analysis_session.hea_file_path and 
                analysis_session.dat_normalized_file_path and analysis_session.hea_normalized_file_path):
                plot_data = plot_generator.generate_combined_dashboard_plot(
                    analysis_session.dat_file_path,
                    analysis_session.hea_file_path,
                    analysis_session.dat_normalized_file_path,
                    analysis_session.hea_normalized_file_path
                )
        
        else:
            raise HTTPException(status_code=400, detail=f"Unknown plot type: {plot_type}")
        
        if plot_data is None:
            raise HTTPException(status_code=404, detail=f"Could not generate {plot_type} plot - missing required files")
        
        return JSONResponse(content={
            "success": True,
            "patient_id": patient_id,
            "plot_type": plot_type,
            "plot_data": plot_data
        })
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating {plot_type} plot for patient {patient_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate {plot_type} plot: {str(e)}")

@router.get("/plot-info/{patient_id}")
async def get_plot_info(
    patient_id: str,
    db: Session = Depends(get_db)
    # TODO: Re-enable authentication: current_user: dict = Depends(get_current_user)
):
    """Get information about available plots for a patient"""
    
    try:
        # Get the most recent analysis session for this patient
        analysis_session = db.query(AnalysisSession).filter(
            AnalysisSession.patient_id == patient_id
        ).order_by(AnalysisSession.created_at.desc()).first()
        
        if not analysis_session:
            raise HTTPException(status_code=404, detail="No analysis session found for this patient")
        
        # Check file availability
        files_info = {
            'dat_file': {
                'path': analysis_session.dat_file_path,
                'exists': analysis_session.dat_file_path and os.path.exists(analysis_session.dat_file_path)
            },
            'hea_file': {
                'path': analysis_session.hea_file_path,
                'exists': analysis_session.hea_file_path and os.path.exists(analysis_session.hea_file_path)
            },
            'dat_normalized_file': {
                'path': analysis_session.dat_normalized_file_path,
                'exists': analysis_session.dat_normalized_file_path and os.path.exists(analysis_session.dat_normalized_file_path)
            },
            'hea_normalized_file': {
                'path': analysis_session.hea_normalized_file_path,
                'exists': analysis_session.hea_normalized_file_path and os.path.exists(analysis_session.hea_normalized_file_path)
            },
            'breath_annotation_file': {
                'path': analysis_session.breath_annotation_file_path,
                'exists': analysis_session.breath_annotation_file_path and os.path.exists(analysis_session.breath_annotation_file_path)
            }
        }
        
        # Determine available plots
        available_plots = []
        
        if files_info['dat_file']['exists'] and files_info['hea_file']['exists']:
            available_plots.extend(['ecg_waveform', 'hrv_analysis'])
        
        if files_info['dat_normalized_file']['exists'] and files_info['hea_normalized_file']['exists']:
            available_plots.append('vital_signs_trend')
        
        if (files_info['dat_file']['exists'] and files_info['hea_file']['exists'] and 
            files_info['breath_annotation_file']['exists']):
            available_plots.append('respiratory_pattern')
        
        if (files_info['dat_file']['exists'] and files_info['hea_file']['exists'] and 
            files_info['dat_normalized_file']['exists'] and files_info['hea_normalized_file']['exists']):
            available_plots.append('combined_dashboard')
        
        return JSONResponse(content={
            "success": True,
            "patient_id": patient_id,
            "session_id": analysis_session.session_id,
            "files_info": files_info,
            "available_plots": available_plots,
            "total_plots_available": len(available_plots)
        })
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting plot info for patient {patient_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get plot info: {str(e)}") 