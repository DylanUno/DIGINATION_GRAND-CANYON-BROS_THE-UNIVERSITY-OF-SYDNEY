"""
SQLAlchemy Base class
Separate file to avoid circular imports
"""

from sqlalchemy.ext.declarative import declarative_base

# Create Base class for all models
Base = declarative_base() 