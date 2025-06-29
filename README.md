# VitalSense Pro - AI-Powered Multi-Modal Health Analysis Platform

A comprehensive healthcare platform that bridges the gap between patients at local health centers and urban medical specialists through intelligent vital sign analysis and remote consultation capabilities.

## 🏗️ Architecture

This is a distributed application with three main components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Vercel)      │◄──►│   (Your Laptop) │◄──►│   (Neon Cloud)  │
│ localhost:3000  │    │ localhost:8000  │    │   Cloud URL     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

- **Frontend**: Next.js application (deployed on Vercel or running locally)
- **Backend**: Python FastAPI service (runs locally on laptop)
- **Database**: PostgreSQL (hosted on Neon cloud)

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

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000

### 3. Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp env.example .env
# Edit .env with your actual values (see backend/README.md)
python main.py
```

The backend API will be available at http://localhost:8000

## 📁 Project Structure

```
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (health-worker)/  # Health worker portal
│   │   │   ├── (patient)/        # Patient portal  
│   │   │   ├── (specialist)/     # Specialist portal
│   │   │   └── auth/             # Authentication pages
│   │   └── components/           # Shared UI components
│   ├── package.json
│   └── next.config.js
├── backend/                  # Python FastAPI service
│   ├── main.py              # API entry point
│   ├── models/              # Database models
│   ├── routers/             # API endpoints
│   ├── services/            # Business logic
│   ├── utils/               # Helper functions
│   ├── requirements.txt
│   └── uploads/             # Temporary file storage
└── PROJECT_PLAN.md          # Detailed project specification
```

## 🎯 Three-Portal System

### 1. Health Worker Portal
- **Purpose**: Data collection at local health centers
- **Users**: Trained health workers/nurses
- **Features**: Patient registration, vital signs upload, symptom recording, patient queue management

### 2. Specialist Portal  
- **Purpose**: Expert medical review and consultation
- **Users**: Licensed medical specialists
- **Features**: AI-prioritized patient queue, data visualization, consultation tools, diagnosis coding

### 3. Patient Portal
- **Purpose**: Results access for patients
- **Users**: Patients with accounts
- **Features**: Medical history, analysis results, specialist recommendations

## 🔧 For Demo Day

### Using ngrok for Vercel ↔ Local Backend Connection

When your frontend is deployed on Vercel but backend runs locally:

```bash
# 1. Install ngrok
# Download from https://ngrok.com/download

# 2. Start your backend
cd backend
python main.py

# 3. In another terminal, expose backend
ngrok http 8000

# 4. Copy the ngrok URL (e.g., https://abc123.ngrok.io)
# 5. Update frontend environment variables on Vercel to use this URL
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

## 📚 Documentation

- [Backend API Documentation](backend/README.md)
- [Complete Project Plan](PROJECT_PLAN.md)
- [API Documentation](http://localhost:8000/docs) (when backend is running)

## 🤝 Contributing

This project follows a structured development approach with clear separation between frontend UI generation and backend logic implementation.

## 📄 License

This project is developed for educational purposes as part of the DIGINATION competition.
