"""
User model for authentication
Handles health workers, specialists, and patients
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from base import Base

class UserRole(enum.Enum):
    """User role enumeration"""
    HEALTH_WORKER = "health_worker"
    SPECIALIST = "specialist"
    PATIENT = "patient"

class User(Base):
    """
    User model for authentication
    Supports three types of users: health workers, specialists, and patients
    """
    __tablename__ = "users"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Authentication fields
    email = Column(String, unique=True, index=True, nullable=True)  # Optional for health workers
    phone = Column(String, unique=True, index=True, nullable=True)  # Alternative login for patients
    professional_credentials = Column(String, unique=True, index=True, nullable=True)  # For specialists
    health_center_id = Column(Integer, nullable=True)  # For health workers
    
    # Security
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)  # For specialist license verification
    
    # Profile information
    full_name = Column(String, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    def __repr__(self):
        return f"<User(id={self.id}, role={self.role.value}, name='{self.full_name}')>" 