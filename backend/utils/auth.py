"""
JWT token utilities for authentication and authorization
"""

from datetime import datetime, timedelta, timezone
from typing import Optional, Union
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from config import settings
from database import SessionLocal
from models.user import User, UserRole
from .security import verify_password

# Security scheme for Bearer token
security = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a new JWT access token
    
    Args:
        data: Data to encode in the token
        expires_delta: Token expiration time (default: 24 hours)
        
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(hours=24)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """
    Verify and decode a JWT token
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token payload or None if invalid
    """
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload
    except JWTError:
        return None

def get_db() -> Session:
    """
    Dependency to get database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user from JWT token
    
    Args:
        credentials: HTTP Bearer credentials
        db: Database session
        
    Returns:
        Current user object
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Verify token
    payload = verify_token(credentials.credentials)
    if payload is None:
        raise credentials_exception
    
    # Get user ID from token
    user_id: Optional[int] = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    # Get user from database
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is disabled"
        )
    
    return user

def authenticate_user(
    db: Session, 
    email: Optional[str] = None,
    phone: Optional[str] = None,
    professional_credentials: Optional[str] = None,
    password: str = ""
) -> Optional[User]:
    """
    Authenticate a user with different login methods
    
    Args:
        db: Database session
        email: Email address (for specialists/some health workers)
        phone: Phone number (for patients/health workers)
        professional_credentials: Professional ID (for specialists)
        password: Password
        
    Returns:
        User object if authentication successful, None otherwise
    """
    # Find user by different authentication methods
    user = None
    
    if email:
        user = db.query(User).filter(User.email == email).first()
    elif phone:
        user = db.query(User).filter(User.phone == phone).first()
    elif professional_credentials:
        user = db.query(User).filter(User.professional_credentials == professional_credentials).first()
    
    if not user:
        return None
    
    # Verify password
    if not verify_password(password, user.password_hash):
        return None
    
    # Check if user is active
    if not user.is_active:
        return None
    
    return user

def require_role(allowed_roles: list[UserRole]):
    """
    Decorator to require specific user roles
    
    Args:
        allowed_roles: List of allowed user roles
        
    Returns:
        Dependency function that checks user role
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {[role.value for role in allowed_roles]}"
            )
        return current_user
    
    return role_checker

# Role-specific dependencies
def get_current_health_worker(current_user: User = Depends(require_role([UserRole.HEALTH_WORKER]))) -> User:
    """Get current health worker user"""
    return current_user

def get_current_specialist(current_user: User = Depends(require_role([UserRole.SPECIALIST]))) -> User:
    """Get current specialist user"""
    return current_user

def get_current_patient(current_user: User = Depends(require_role([UserRole.PATIENT]))) -> User:
    """Get current patient user"""
    return current_user

def get_current_admin(current_user: User = Depends(require_role([UserRole.HEALTH_WORKER, UserRole.SPECIALIST]))) -> User:
    """Get current admin user (health worker or specialist)"""
    return current_user 