# VitalSense Pro Backend

FastAPI backend service for the AI-Powered Multi-Modal Health Analysis Platform.

## Architecture

This backend runs locally on your laptop at `localhost:8000` and connects to:
- **Database**: Neon Cloud (PostgreSQL)
- **Frontend**: Vercel deployment or local Next.js
- **AI Services**: OpenAI, Google Gemini, or Anthropic APIs

## Quick Start

### 1. Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Environment Setup

```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your actual values:
# - Neon database URL
# - AI API keys
# - Secret key for JWT tokens
```

### 3. Run the Server

```bash
# Start the FastAPI server
python main.py

# Or use uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **Main API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## For Demo Day

### Using ngrok for Vercel Connection

When your frontend is deployed on Vercel, you'll need to expose your local backend:

```bash
# Install ngrok (if not already installed)
# Download from https://ngrok.com/download

# Expose local port 8000
ngrok http 8000

# Copy the public URL (e.g., https://abc123.ngrok.io)
# Update your frontend's API_URL environment variable to use this URL
```

### Starting Everything for Demo

```bash
# 1. Start the backend
cd backend
python main.py

# 2. In another terminal, start ngrok
ngrok http 8000

# 3. Your Vercel frontend will now connect to your local backend!
```

## Project Structure

```
backend/
├── main.py              # FastAPI app entry point
├── requirements.txt     # Python dependencies
├── env.example         # Environment variables template
├── Dockerfile          # For future deployment
├── models/             # Database models (SQLAlchemy)
├── routers/            # API route handlers
├── services/           # Business logic
├── utils/              # Helper functions
└── uploads/            # Temporary file storage
```

## API Endpoints (Planned)

- `GET /` - Health check
- `POST /api/auth/login` - User authentication
- `POST /api/patients/` - Create patient
- `GET /api/patients/{id}` - Get patient details
- `POST /api/analysis/upload` - Upload medical data
- `POST /api/analysis/start` - Start AI analysis
- `GET /api/analysis/{id}` - Get analysis results
- `POST /api/specialists/consultation` - Save specialist feedback

## Development Notes

- The backend handles all data processing, AI integration, and database operations
- Files are temporarily stored locally during processing
- All processed results are saved to the Neon cloud database
- CORS is configured to allow connections from Vercel and localhost 