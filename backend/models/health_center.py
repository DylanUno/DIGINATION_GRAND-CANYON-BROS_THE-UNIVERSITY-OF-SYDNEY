"""
Health Center model
Represents local health facilities (Puskesmas)
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from base import Base

class HealthCenter(Base):
    """
    Health Center model
    Represents local health facilities where health workers operate
    """
    __tablename__ = "health_centers"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic information
    name = Column(String, nullable=False, index=True)
    code = Column(String, unique=True, nullable=False, index=True)  # Unique facility code
    
    # Location information
    address = Column(Text, nullable=False)
    village = Column(String, nullable=False)
    district = Column(String, nullable=False)
    city = Column(String, nullable=False)
    province = Column(String, nullable=False)
    postal_code = Column(String, nullable=True)
    
    # Contact information
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    
    # Administrative
    is_active = Column(Boolean, default=True)
    license_number = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<HealthCenter(id={self.id}, name='{self.name}', code='{self.code}')>" 