"""
VitalSense Pro Backend API
Main FastAPI application entry point
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from contextlib import asynccontextmanager

# Import our configuration and database
from config import settings
from database import create_tables, test_connection

# Import our route modules
from routers import auth, upload, video_processing, specialist_analysis, plot_api

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events"""
    # Startup: Test database connection and create tables
    print("🚀 Starting VitalSense Pro Backend...")
    print(f"🔧 Environment: {settings.environment}")
    
    # Test database connection
    if test_connection():
        print("✅ Database connection successful")
        # Create tables
        if create_tables():
            print("✅ Database tables ready")
        else:
            print("⚠️  Database table creation had issues")
    else:
        print("❌ Database connection failed - check your DATABASE_URL")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down VitalSense Pro Backend...")

# Create FastAPI app instance
app = FastAPI(
    title="VitalSense Pro API",
    description="AI-Powered Multi-Modal Health Analysis Platform Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local Next.js development
        "https://*.vercel.app",   # Vercel deployments
        "https://vercel.app"      # Vercel custom domains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
async def root():
    """Root endpoint for health checks"""
    return {
        "message": "VitalSense Pro Backend API",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs",
        "environment": settings.environment
    }

@app.get("/health")
async def health_check():
    """Detailed health check endpoint"""
    # Test database connection
    db_status = "connected" if test_connection() else "disconnected"
    
    return {
        "status": "healthy",
        "service": "vitalsense-pro-backend",
        "database": db_status,
        "environment": settings.environment,
        "ai_services": "available"
    }

@app.get("/config")
async def get_config():
    """Get non-sensitive configuration info"""
    return {
        "environment": settings.environment,
        "debug": settings.debug,
        "upload_dir": settings.upload_dir,
        "max_file_size_mb": settings.max_file_size,
        "database_connected": test_connection()
    }

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(upload.router, prefix="/api/upload", tags=["file-upload"])
app.include_router(video_processing.router, prefix="/api/video", tags=["video-processing"])
app.include_router(specialist_analysis.router, prefix="/api/specialist-analysis", tags=["specialist-analysis"])
app.include_router(plot_api.router, prefix="/api/plots", tags=["medical-plots"])
# app.include_router(patients.router, prefix="/api/patients", tags=["patients"])
# app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])
# app.include_router(specialists.router, prefix="/api/specialists", tags=["specialists"])

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload during development
        log_level="info"
    ) 