"""
Database connection and SQLAlchemy setup for VitalSense Pro
Connects to Neon PostgreSQL database
"""

from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import Engine
from typing import Generator

from config import get_database_url

# Import all models so SQLAlchemy can create tables
from models.user import User
from models.patient import Patient
from models.health_center import HealthCenter
from models.analysis_session import AnalysisSession
from models.specialist_consultation import SpecialistConsultation

# Create SQLAlchemy engine
engine: Engine = create_engine(
    get_database_url(),
    echo=True,  # Set to False in production
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,  # Recycle connections every 5 minutes
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Import Base class from separate file to avoid circular imports
from base import Base

# Metadata for table creation
metadata = MetaData()

def get_db() -> Generator:
    """
    Database dependency for FastAPI
    Creates a new database session for each request
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Create all database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to create database tables: {e}")
        return False

def test_connection():
    """Test database connection"""
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ Connected to PostgreSQL: {version}")
            return True
    except Exception as e:
        print(f"❌ Database connection test failed: {e}")
        return False 