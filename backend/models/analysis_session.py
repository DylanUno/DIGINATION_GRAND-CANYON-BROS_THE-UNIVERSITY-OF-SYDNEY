"""
Analysis Session model
Core table storing vital signs data, AI results, and analysis status
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey, Enum, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from base import Base

class AnalysisStatus(enum.Enum):
    """Analysis status enumeration"""
    UPLOADED = "uploaded"  # Files uploaded, not processed yet
    PROCESSING = "processing"  # AI analysis in progress
    AI_COMPLETE = "ai_complete"  # AI analysis done, waiting for specialist
    SPECIALIST_REVIEWING = "specialist_reviewing"  # Specialist is reviewing
    COMPLETED = "completed"  # Specialist has provided feedback
    ERROR = "error"  # Something went wrong

class RiskLevel(enum.Enum):
    """Risk level enumeration"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AnalysisSession(Base):
    """
    Analysis Session model
    Central table storing all data for a single patient analysis
    """
    __tablename__ = "analysis_sessions"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign keys
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False, index=True)
    health_worker_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Who uploaded
    specialist_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Who reviewed
    health_center_id = Column(Integer, ForeignKey("health_centers.id"), nullable=False)
    
    # Status tracking
    status = Column(Enum(AnalysisStatus), default=AnalysisStatus.UPLOADED, nullable=False, index=True)
    ai_risk_level = Column(Enum(RiskLevel), nullable=True, index=True)
    final_risk_level = Column(Enum(RiskLevel), nullable=True)  # After specialist review
    
    # File information
    vital_signs_file_path = Column(String, nullable=True)  # Path to .dat file
    header_file_path = Column(String, nullable=True)  # Path to .hea file
    video_file_path = Column(String, nullable=True)  # Path to video file
    
    # Patient symptoms (from health worker input)
    chief_complaint = Column(String, nullable=True)
    symptoms = Column(JSON, nullable=True)  # Structured symptoms data
    pain_level = Column(Integer, nullable=True)  # 0-10 scale
    symptom_duration = Column(String, nullable=True)
    additional_notes = Column(Text, nullable=True)
    
    # Processed vital signs data
    recording_duration_seconds = Column(Integer, nullable=True)
    heart_rate_bpm = Column(Float, nullable=True)
    respiratory_rate_bpm = Column(Float, nullable=True)
    pulse_rate_bpm = Column(Float, nullable=True)
    spo2_percent = Column(Float, nullable=True)
    hrv_sdnn = Column(Float, nullable=True)
    hrv_rmssd = Column(Float, nullable=True)
    
    # Raw signals and processed data (stored as JSON)
    vital_signs_data = Column(JSON, nullable=True)  # Full time series data
    signal_quality_metrics = Column(JSON, nullable=True)
    
    # Video analysis results (VitalLens)
    video_respiratory_rate = Column(Float, nullable=True)
    video_analysis_confidence = Column(Float, nullable=True)
    video_analysis_results = Column(JSON, nullable=True)
    
    # AI analysis results
    ai_analysis_results = Column(JSON, nullable=True)  # Full LLM response
    ai_clinical_findings = Column(JSON, nullable=True)  # Structured findings
    ai_recommendations = Column(Text, nullable=True)
    ai_confidence_score = Column(Float, nullable=True)
    ai_processing_time_seconds = Column(Float, nullable=True)
    
    # Specialist review
    specialist_notes = Column(Text, nullable=True)
    specialist_diagnosis_codes = Column(JSON, nullable=True)  # ICD-10 codes
    specialist_recommendations = Column(Text, nullable=True)
    specialist_follow_up_needed = Column(Boolean, default=False)
    specialist_follow_up_timeframe = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    ai_analysis_started_at = Column(DateTime(timezone=True), nullable=True)
    ai_analysis_completed_at = Column(DateTime(timezone=True), nullable=True)
    specialist_review_started_at = Column(DateTime(timezone=True), nullable=True)
    specialist_review_completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    patient = relationship("Patient", backref="analysis_sessions")
    health_worker = relationship("User", foreign_keys=[health_worker_user_id], backref="uploaded_sessions")
    specialist = relationship("User", foreign_keys=[specialist_user_id], backref="reviewed_sessions")
    health_center = relationship("HealthCenter", backref="analysis_sessions")
    
    def __repr__(self):
        return f"<AnalysisSession(id={self.id}, patient_id={self.patient_id}, status={self.status.value})>" 