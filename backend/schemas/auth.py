"""
Authentication-related Pydantic schemas
"""

from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class LoginRequest(BaseModel):
    """
    Login request schema - supports multiple authentication methods
    """
    # Authentication methods (only one should be provided)
    email: Optional[str] = Field(None, description="Email address (for specialists/health workers)")
    phone: Optional[str] = Field(None, description="Phone number (for patients/health workers)")
    professional_credentials: Optional[str] = Field(None, description="Professional ID (for specialists)")
    
    # Required for all logins
    password: str = Field(..., min_length=1, description="User password")
    
    @validator('email', 'phone', 'professional_credentials', pre=True)
    def clean_string_fields(cls, v):
        """Clean and validate string fields"""
        if v is not None:
            return v.strip() if isinstance(v, str) else v
        return v
    
    @validator('professional_credentials')
    def validate_professional_credentials(cls, v):
        """Validate professional credentials format"""
        if v is not None and len(v.strip()) < 3:
            raise ValueError("Professional credentials must be at least 3 characters")
        return v
    
    def __init__(self, **data):
        super().__init__(**data)
        # Ensure at least one authentication method is provided
        auth_methods = [self.email, self.phone, self.professional_credentials]
        valid_methods = [method for method in auth_methods if method is not None and method.strip()]
        
        if len(valid_methods) == 0:
            raise ValueError("At least one authentication method (email, phone, or professional_credentials) must be provided")
        
        if len(valid_methods) > 1:
            raise ValueError("Only one authentication method should be provided at a time")

class TokenData(BaseModel):
    """
    JWT token payload data
    """
    user_id: int
    role: str
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    expires_at: datetime

class UserInfo(BaseModel):
    """
    User information included in login response
    """
    id: int
    full_name: str
    role: str
    email: Optional[str] = None
    phone: Optional[str] = None
    is_verified: bool = False
    last_login: Optional[datetime] = None
    created_at: datetime

class LoginResponse(BaseModel):
    """
    Successful login response
    """
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration time in seconds")
    user: UserInfo = Field(..., description="User information")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class PasswordChangeRequest(BaseModel):
    """
    Password change request
    """
    current_password: str = Field(..., description="Current password")
    new_password: str = Field(..., min_length=8, description="New password (minimum 8 characters)")
    confirm_password: str = Field(..., description="Confirm new password")
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        """Ensure new password and confirmation match"""
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Passwords do not match')
        return v

class PasswordResetRequest(BaseModel):
    """
    Password reset request (for future implementation)
    """
    email: Optional[str] = None
    phone: Optional[str] = None
    
    def __init__(self, **data):
        super().__init__(**data)
        if not self.email and not self.phone:
            raise ValueError("Either email or phone must be provided for password reset")

class LogoutResponse(BaseModel):
    """
    Logout response
    """
    message: str = Field(default="Successfully logged out")
    logged_out_at: datetime = Field(default_factory=datetime.now) 