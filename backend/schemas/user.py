"""
User-related Pydantic schemas
"""

from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
from models.user import UserRole

class UserCreate(BaseModel):
    """
    Schema for creating a new user
    """
    full_name: str = Field(..., min_length=2, max_length=100, description="User's full name")
    role: UserRole = Field(..., description="User role")
    
    # Authentication fields (role-dependent)
    email: Optional[str] = Field(None, description="Email address")
    phone: Optional[str] = Field(None, description="Phone number")
    professional_credentials: Optional[str] = Field(None, description="Professional credentials/license")
    health_center_id: Optional[int] = Field(None, description="Health center ID (for health workers)")
    
    # Password
    password: str = Field(..., min_length=8, description="Password (minimum 8 characters)")
    
    @validator('email')
    def validate_email(cls, v):
        """Basic email validation"""
        if v is not None:
            import re
            if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', v):
                raise ValueError('Invalid email format')
        return v
    
    @validator('phone')
    def validate_phone(cls, v):
        """Basic phone validation"""
        if v is not None:
            # Remove spaces and common separators
            cleaned = ''.join(c for c in v if c.isdigit() or c == '+')
            if len(cleaned) < 10 or len(cleaned) > 15:
                raise ValueError('Phone number must be 10-15 digits')
        return v

class UserResponse(BaseModel):
    """
    Schema for user response (public information)
    """
    id: int
    full_name: str
    role: str
    email: Optional[str] = None
    phone: Optional[str] = None
    professional_credentials: Optional[str] = None
    health_center_id: Optional[int] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class UserUpdate(BaseModel):
    """
    Schema for updating user information
    """
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[str] = None
    phone: Optional[str] = None
    
    @validator('email')
    def validate_email(cls, v):
        """Basic email validation"""
        if v is not None:
            import re
            if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', v):
                raise ValueError('Invalid email format')
        return v
    
    @validator('phone')
    def validate_phone(cls, v):
        """Basic phone validation"""
        if v is not None:
            # Remove spaces and common separators
            cleaned = ''.join(c for c in v if c.isdigit() or c == '+')
            if len(cleaned) < 10 or len(cleaned) > 15:
                raise ValueError('Phone number must be 10-15 digits')
        return v

class UserProfile(BaseModel):
    """
    Detailed user profile information
    """
    id: int
    full_name: str
    role: str
    email: Optional[str] = None
    phone: Optional[str] = None
    professional_credentials: Optional[str] = None
    health_center_id: Optional[int] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    
    # Additional profile information will be added here
    # (e.g., specializations for specialists, patient info for patients)
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        } 