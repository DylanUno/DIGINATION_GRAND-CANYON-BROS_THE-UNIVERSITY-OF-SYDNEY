# VitalSense Pro - Development Setup Guide

## 🏗️ Architecture Overview

This is a **full-stack application** with separated frontend and backend:

```
VitalSense Pro/
├── frontend/          # Next.js 15 + React 19 (Port 3000)
├── backend/           # FastAPI + Python (Port 8000)
├── backend_venv/      # Python virtual environment
└── package.json       # Root scripts for both services
```

## 🚀 Quick Start (Recommended)

### Option 1: Run Both Services Simultaneously

```bash
# From the root directory
npm run dev
```

This will start:
- **Backend**: http://localhost:8000 (FastAPI)
- **Frontend**: http://localhost:3000 (Next.js)

### Option 2: Run Services Separately

#### Terminal 1 - Backend (FastAPI)
```bash
cd backend
# Virtual environment should already be activated
python main.py
```

#### Terminal 2 - Frontend (Next.js)
```bash
cd frontend
npm run dev
```

## 🔧 System Requirements

### Backend Requirements:
- **Python 3.8+** (with virtual environment)
- **PostgreSQL database** (configured in backend/.env)
- **Python dependencies** (installed in backend_venv)

### Frontend Requirements:
- **Node.js 18+**
- **npm or pnpm**
- **Modern browser** (Chrome, Firefox, Safari, Edge)

## 🌐 Application URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js React application |
| Backend API | http://localhost:8000 | FastAPI backend server |
| API Documentation | http://localhost:8000/docs | Interactive API docs (Swagger) |
| Backend Health | http://localhost:8000/health | Backend health check |

## 📱 Using the Application

### 1. Access the Landing Page
- Open: http://localhost:3000
- You'll see the VitalSense Pro homepage

### 2. Test the Login System
- **Health Worker**: http://localhost:3000/auth/login/health-worker
- **Specialist**: http://localhost:3000/auth/login/specialist
- **Patient**: http://localhost:3000/auth/login/patient

### 3. Explore the Dashboards
- **Health Worker Dashboard**: http://localhost:3000/health-worker/dashboard
- **Specialist Dashboard**: http://localhost:3000/specialist/dashboard
- **Patient Dashboard**: http://localhost:3000/patient/dashboard

## 🔍 Troubleshooting

### "Pages Loading Forever" Issue

**Cause**: Frontend is trying to connect to backend API, but backend isn't running.

**Solution**: 
1. Make sure BOTH services are running
2. Check that backend is running on port 8000
3. Check that frontend is running on port 3000

### Check Backend Status
```bash
curl http://localhost:8000/health
```

Should return:
```json
{
  "status": "healthy",
  "service": "vitalsense-pro-backend",
  "database": "connected",
  "environment": "development"
}
```

### Check Frontend Status
- Open: http://localhost:3000
- Should show VitalSense Pro landing page

## 🛠️ Development Commands

```bash
# Run both services
npm run dev

# Run only frontend
npm run dev:frontend

# Run only backend
npm run dev:backend

# Install all dependencies
npm run install:all

# Build frontend for production
npm run build
```

## 🗄️ Database Setup

The backend requires a PostgreSQL database. Configuration is in `backend/.env`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/vitalsense_db
```

## 🎯 Next Steps

1. **Test the Application**: Try navigating between different portals
2. **Check API Connection**: Verify frontend can communicate with backend
3. **Database Integration**: Connect to your PostgreSQL database
4. **Add Authentication**: Implement real user authentication
5. **AI Features**: Add the health analysis AI functionality

## 🔧 Project Structure

```
├── frontend/              # Next.js Application
│   ├── app/              # App Router pages
│   ├── components/       # Reusable components
│   ├── lib/             # Utilities and schemas
│   └── public/          # Static assets
├── backend/              # FastAPI Application
│   ├── models/          # Database models
│   ├── routers/         # API routes
│   ├── schemas/         # Pydantic schemas
│   └── utils/           # Backend utilities
└── backend_venv/         # Python virtual environment
```

## 🚨 Common Issues

### 1. Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

### 2. Database Connection Issues
- Check PostgreSQL is running
- Verify DATABASE_URL in backend/.env
- Check database permissions

### 3. Python Virtual Environment Issues
```bash
# Activate virtual environment
source backend_venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

---

**Need Help?** Check the API documentation at http://localhost:8000/docs when the backend is running. 