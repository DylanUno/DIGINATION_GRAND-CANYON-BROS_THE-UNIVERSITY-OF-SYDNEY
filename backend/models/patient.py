"""
Patient model
Stores patient demographic and medical information
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from base import Base

class Gender(enum.Enum):
    """Gender enumeration"""
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class Patient(Base):
    """
    Patient model
    Stores comprehensive patient information and medical history
    """
    __tablename__ = "patients"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Link to user account
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    
    # Demographics
    full_name = Column(String, nullable=False, index=True)
    age = Column(Integer, nullable=False)
    gender = Column(Enum(Gender), nullable=False)
    
    # Physical characteristics
    weight_kg = Column(Float, nullable=True)
    height_cm = Column(Float, nullable=True)
    
    # Contact information
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    
    # Address
    address = Column(Text, nullable=True)
    village = Column(String, nullable=True)
    district = Column(String, nullable=True)
    city = Column(String, nullable=True)
    province = Column(String, nullable=True)
    
    # Emergency contact
    emergency_contact_name = Column(String, nullable=True)
    emergency_contact_phone = Column(String, nullable=True)
    emergency_contact_relationship = Column(String, nullable=True)
    
    # Medical history
    known_conditions = Column(Text, nullable=True)  # JSON string of conditions
    current_medications = Column(Text, nullable=True)  # JSON string of medications
    allergies = Column(Text, nullable=True)  # JSON string of allergies
    previous_surgeries = Column(Text, nullable=True)  # Surgical history and hospitalizations
    
    # Administrative
    patient_id = Column(String, unique=True, nullable=True, index=True)  # External patient ID
    registered_at_health_center_id = Column(Integer, ForeignKey("health_centers.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", backref="patient")
    health_center = relationship("HealthCenter", backref="patients")
    
    def __repr__(self):
        return f"<Patient(id={self.id}, name='{self.full_name}', age={self.age})>" 