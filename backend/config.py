"""
Configuration settings for VitalSense Pro Backend
Handles environment variables and database connections
"""

import os
from pydantic_settings import BaseSettings
from pydantic import validator
from typing import Optional

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database
    database_url: str = "postgresql://user:pass@localhost/db"
    
    # Security
    secret_key: str = "your-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # AI API Keys (optional - we'll add them later)
    openai_api_key: Optional[str] = None
    google_ai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    vitallens_api_key: Optional[str] = None
    
    # File Storage
    upload_dir: str = "./uploads"
    max_file_size: int = 100  # MB
    
    # Environment
    debug: bool = True
    environment: str = "development"
    
    @validator('database_url')
    def validate_database_url(cls, v):
        if v == "postgresql://user:pass@localhost/db":
            print("⚠️  Warning: Using default database URL. Please set DATABASE_URL in your .env file")
        return v
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        extra = "ignore"  # Ignore extra fields in .env file

# Create global settings instance
settings = Settings()

# Database connection test
def test_database_connection():
    """Test if we can connect to the database"""
    try:
        from sqlalchemy import create_engine, text
        engine = create_engine(settings.database_url)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def get_database_url() -> str:
    """Get the database URL for SQLAlchemy"""
    return settings.database_url 