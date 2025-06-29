"""
Authentication router for VitalSense Pro
Handles login, logout, and token management for all user types
"""

from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from typing import Optional

from utils.auth import (
    authenticate_user, 
    create_access_token, 
    get_current_user,
    get_db
)
from utils.security import hash_password, verify_password, is_password_strong
from schemas.auth import (
    LoginRequest, 
    LoginResponse, 
    UserInfo, 
    PasswordChangeRequest,
    LogoutResponse
)
from models.user import User, UserRole
from config import settings

# Create router
router = APIRouter()
security = HTTPBearer()

@router.post("/login", response_model=LoginResponse)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Authenticate user with email, phone, or professional credentials
    
    Supports three authentication methods:
    - Email (for specialists and some health workers)
    - Phone (for patients and health workers) 
    - Professional credentials (for specialists)
    """
    # Authenticate user
    user = authenticate_user(
        db=db,
        email=login_data.email,
        phone=login_data.phone,
        professional_credentials=login_data.professional_credentials,
        password=login_data.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user account is verified (for specialists)
    if user.role == UserRole.SPECIALIST and not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account pending verification. Please contact administrator.",
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    token_data = {
        "sub": str(user.id),
        "role": user.role.value,
        "full_name": user.full_name
    }
    access_token = create_access_token(
        data=token_data, 
        expires_delta=access_token_expires
    )
    
    # Update last login time
    user.last_login = datetime.now()
    db.commit()
    
    # Prepare user info for response
    user_info = UserInfo(
        id=user.id,
        full_name=user.full_name,
        role=user.role.value,
        email=user.email,
        phone=user.phone,
        is_verified=user.is_verified,
        last_login=user.last_login,
        created_at=user.created_at
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,  # Convert to seconds
        user=user_info
    )

@router.post("/logout", response_model=LogoutResponse)
async def logout(current_user: User = Depends(get_current_user)):
    """
    Logout current user
    
    Note: In a stateless JWT system, actual logout is handled client-side
    by removing the token. This endpoint is for logging purposes.
    """
    return LogoutResponse(
        message="Successfully logged out",
        logged_out_at=datetime.now()
    )

@router.get("/me", response_model=UserInfo)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information
    """
    return UserInfo(
        id=current_user.id,
        full_name=current_user.full_name,
        role=current_user.role.value,
        email=current_user.email,
        phone=current_user.phone,
        is_verified=current_user.is_verified,
        last_login=current_user.last_login,
        created_at=current_user.created_at
    )

@router.post("/change-password")
async def change_password(
    password_data: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Change user password
    """
    # Verify current password
    if not verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Check new password strength
    is_strong, issues = is_password_strong(password_data.new_password)
    if not is_strong:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Password does not meet requirements: {', '.join(issues)}"
        )
    
    # Update password
    current_user.password_hash = hash_password(password_data.new_password)
    db.commit()
    
    return {"message": "Password successfully changed"}

@router.post("/refresh-token", response_model=LoginResponse)
async def refresh_token(current_user: User = Depends(get_current_user)):
    """
    Refresh access token for current user
    """
    # Create new access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    token_data = {
        "sub": str(current_user.id),
        "role": current_user.role.value,
        "full_name": current_user.full_name
    }
    access_token = create_access_token(
        data=token_data, 
        expires_delta=access_token_expires
    )
    
    # Prepare user info for response
    user_info = UserInfo(
        id=current_user.id,
        full_name=current_user.full_name,
        role=current_user.role.value,
        email=current_user.email,
        phone=current_user.phone,
        is_verified=current_user.is_verified,
        last_login=current_user.last_login,
        created_at=current_user.created_at
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,
        user=user_info
    )

@router.get("/validate-token")
async def validate_token(current_user: User = Depends(get_current_user)):
    """
    Validate if current token is still valid
    """
    return {
        "valid": True,
        "user_id": current_user.id,
        "role": current_user.role.value,
        "message": "Token is valid"
    } 