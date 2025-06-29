"""
Specialist Consultation model
Tracks detailed specialist feedback and consultation history
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Enum, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from base import Base

class ConsultationType(enum.Enum):
    """Consultation type enumeration"""
    INITIAL_REVIEW = "initial_review"
    FOLLOW_UP = "follow_up"
    EMERGENCY_REVIEW = "emergency_review"
    SECOND_OPINION = "second_opinion"

class ConsultationPriority(enum.Enum):
    """Consultation priority enumeration"""
    ROUTINE = "routine"
    URGENT = "urgent"
    EMERGENCY = "emergency"

class SpecialistConsultation(Base):
    """
    Specialist Consultation model
    Detailed tracking of specialist interactions and recommendations
    """
    __tablename__ = "specialist_consultations"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign keys
    analysis_session_id = Column(Integer, ForeignKey("analysis_sessions.id"), nullable=False, index=True)
    specialist_user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False, index=True)
    
    # Consultation details
    consultation_type = Column(Enum(ConsultationType), default=ConsultationType.INITIAL_REVIEW, nullable=False)
    priority = Column(Enum(ConsultationPriority), default=ConsultationPriority.ROUTINE, nullable=False)
    
    # Clinical assessment
    clinical_notes = Column(Text, nullable=True)
    differential_diagnosis = Column(JSON, nullable=True)  # List of possible diagnoses
    primary_diagnosis_code = Column(String, nullable=True)  # ICD-10 code
    secondary_diagnosis_codes = Column(JSON, nullable=True)  # Additional ICD-10 codes
    
    # Treatment recommendations
    treatment_plan = Column(Text, nullable=True)
    medication_recommendations = Column(JSON, nullable=True)
    lifestyle_recommendations = Column(Text, nullable=True)
    
    # Follow-up and referrals
    follow_up_required = Column(Boolean, default=False)
    follow_up_timeframe = Column(String, nullable=True)  # e.g., "1 week", "1 month"
    follow_up_instructions = Column(Text, nullable=True)
    
    # Referrals
    referral_required = Column(Boolean, default=False)
    referral_specialty = Column(String, nullable=True)
    referral_priority = Column(Enum(ConsultationPriority), nullable=True)
    referral_notes = Column(Text, nullable=True)
    
    # Additional tests/investigations
    additional_tests_required = Column(Boolean, default=False)
    recommended_tests = Column(JSON, nullable=True)  # List of tests
    test_priority = Column(Enum(ConsultationPriority), nullable=True)
    
    # Communication
    patient_education_provided = Column(Text, nullable=True)
    health_worker_instructions = Column(Text, nullable=True)
    
    # Quality metrics
    time_to_review_minutes = Column(Integer, nullable=True)  # How long specialist took
    confidence_in_assessment = Column(Integer, nullable=True)  # 1-10 scale
    
    # Administrative
    is_billable = Column(Boolean, default=True)
    consultation_fee = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    consultation_started_at = Column(DateTime(timezone=True), nullable=True)
    consultation_completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    analysis_session = relationship("AnalysisSession", backref="specialist_consultations")
    specialist = relationship("User", foreign_keys=[specialist_user_id], backref="consultations_given")
    patient = relationship("Patient", backref="consultations_received")
    
    def __repr__(self):
        return f"<SpecialistConsultation(id={self.id}, session_id={self.analysis_session_id}, type={self.consultation_type.value})>" 