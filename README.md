# VitalSense Pro - AI-Powered Multi-Modal Health Analysis Platform

A comprehensive healthcare platform that bridges the gap between patients at local health centers and urban medical specialists through intelligent vital sign analysis and remote consultation capabilities.

**✨ Built with custom healthcare UI components and Next.js 15 for modern, responsive healthcare interfaces.**

## 🏗️ Architecture

This is a distributed full-stack application with separated frontend and backend:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js 15)  │◄──►│   (FastAPI)     │◄──►│   (PostgreSQL)  │
│ localhost:3000  │    │ localhost:8000  │    │   Cloud/Local   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

- **Frontend**: Next.js 15 with custom-designed healthcare UI components
- **Backend**: Python FastAPI with medical data processing
- **Database**: PostgreSQL for secure health data storage

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Git

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd DIGINATION_GRAND-CANYON_UNIVERSITY-OF-SYDNEY
```

### 2. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

### 3. Run Both Services (Recommended)

```bash
# Start both frontend and backend simultaneously
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000 (Next.js)
- **Backend**: http://localhost:8000 (FastAPI)
- **API Docs**: http://localhost:8000/docs (Interactive API documentation)

### 4. Alternative: Run Services Separately

#### Frontend Only
```bash
npm run dev:frontend
```

#### Backend Only
```bash
npm run dev:backend
```

## 📁 Project Structure

```
├── frontend/                 # Next.js 15 application with custom UI components
│   ├── app/
│   │   ├── auth/login/[role]/    # Dynamic role-based authentication
│   │   ├── health-worker/        # Health worker portal
│   │   ├── patient/              # Patient portal  
│   │   ├── specialist/           # Specialist portal
│   │   └── globals.css           # Healthcare-themed styling
│   ├── components/
│   │   ├── ui/                   # Custom shadcn/ui healthcare components
│   │   ├── health-worker/        # Portal-specific components
│   │   ├── patient/              # Patient-specific components
│   │   └── specialist/           # Specialist-specific components
│   ├── lib/                      # Utilities and schemas
│   ├── package.json
│   └── tailwind.config.ts        # Custom healthcare design system
├── backend/                  # Python FastAPI service
│   ├── main.py              # API entry point
│   ├── models/              # Database models
│   ├── routers/             # API endpoints
│   ├── services/            # Business logic
│   ├── utils/               # Helper functions
│   ├── requirements.txt
│   └── uploads/             # Temporary file storage
├── backend_venv/            # Python virtual environment
├── package.json             # Root package with concurrent scripts
├── DEV_SETUP.md            # Detailed development guide
└── PROJECT_PLAN.md         # Complete project specification
```

## 🎯 Three-Portal System

### 1. Health Worker Portal (`/health-worker`)
- **Purpose**: Data collection at local health centers
- **Users**: Trained health workers/nurses
- **Features**: Patient registration, vital signs upload, symptom recording, patient queue management
- **UI**: Professional dashboard with statistics, patient management, and workflow tools

### 2. Specialist Portal (`/specialist`)
- **Purpose**: Expert medical review and consultation
- **Users**: Licensed medical specialists
- **Features**: AI-prioritized patient queue, data visualization, consultation tools, diagnosis coding
- **UI**: Medical-grade interface with patient analytics, risk indicators, and clinical decision support

### 3. Patient Portal (`/patient`)
- **Purpose**: Results access for patients
- **Users**: Patients with accounts
- **Features**: Medical history, analysis results, specialist recommendations
- **UI**: User-friendly interface with health status, appointment management, and educational resources

## 🎨 Design System

### Custom Healthcare Components
- **Enhanced Button**: Medical-themed button variants with healthcare colors
- **Status Indicators**: Risk-level badges and processing states
- **Feature Cards**: Healthcare-specific information cards
- **Data Visualization**: Interactive charts and medical data displays

### Healthcare Color Palette
- **Trust Blue** (`#2979FF`): Primary actions and medical trust
- **Health Teal** (`#4DB6AC`): Wellness and health programs
- **Alert Orange** (`#FFA726`): Warnings and important information
- **Risk Colors**: High (red), Medium (orange), Low (green)

## 🔧 Development Commands

```bash
# Run both services concurrently
npm run dev

# Run individual services
npm run dev:frontend     # Next.js frontend only
npm run dev:backend      # FastAPI backend only

# Install all dependencies
npm run install:all

# Build for production
npm run build

# Production start
npm run start
```

## 🧠 AI & Data Processing Features

- **Signal Processing**: Extract clinical metrics from raw vital signs data
- **Video Analysis**: Contactless respiratory analysis from video
- **LLM Integration**: AI-powered clinical assessment using GPT-4/Gemini
- **Risk Stratification**: Automated patient prioritization
- **Data Visualization**: Interactive charts and waveform displays

## 🛡️ Security & Compliance

- JWT-based authentication with role-based access control
- HIPAA-compliant data handling
- Encrypted data transmission and storage
- Audit logging for all patient data access

## 📱 Responsive Design

- **Mobile-first approach** with custom responsive components
- **Touch-friendly interfaces** for tablet use in clinical settings
- **Accessibility compliance** with WCAG guidelines
- **Progressive Web App** capabilities for offline functionality

## 🌐 Application URLs

When running locally:

| Service | URL | Description |
|---------|-----|-------------|
| **Landing Page** | http://localhost:3000 | VitalSense Pro homepage |
| **Health Worker Login** | http://localhost:3000/auth/login/health-worker | Health worker authentication |
| **Specialist Login** | http://localhost:3000/auth/login/specialist | Specialist authentication |
| **Patient Login** | http://localhost:3000/auth/login/patient | Patient authentication |
| **API Backend** | http://localhost:8000 | FastAPI server |
| **API Documentation** | http://localhost:8000/docs | Interactive API docs |

## 🔍 Troubleshooting

### Pages Loading Forever?
- **Cause**: Frontend running without backend
- **Solution**: Run `npm run dev` to start both services

### Check System Health
```bash
# Backend health check
curl http://localhost:8000/health

# Frontend check
open http://localhost:3000
```

## 📚 Documentation

- [Development Setup Guide](DEV_SETUP.md)
- [Complete Project Plan](PROJECT_PLAN.md)
- [API Documentation](http://localhost:8000/docs) (when backend is running)

## 🤝 Contributing

This project follows a structured development approach with:
- **Frontend**: Custom-designed components with Next.js 15
- **Backend**: FastAPI with medical data processing
- **Database**: PostgreSQL with health data models

## 📄 License

This project is developed for educational purposes as part of the DIGINATION competition.
