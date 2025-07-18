#!/bin/bash

echo "🚀 Starting VitalSense Pro Application..."
echo "========================================"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
if ! command_exists python3; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is required but not installed"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is required but not installed"
    exit 1
fi

# Start backend
echo "🔧 Starting Backend Server..."
echo "Activating virtual environment..."
source backend_venv/bin/activate

echo "Starting FastAPI server on http://localhost:8000..."
cd backend
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend Server..."
cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo "Starting Next.js server on http://localhost:3000..."
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ VitalSense Pro is now running!"
echo "========================================"
echo "🔗 Frontend (Next.js): http://localhost:3000"
echo "🔗 Backend (FastAPI):  http://localhost:8000"
echo "🔗 API Docs:           http://localhost:8000/docs"
echo "🔗 Health Check:       http://localhost:8000/health"
echo ""
echo "📋 Available Portals:"
echo "   • Patient Portal:     http://localhost:3000/patient"
echo "   • Health Worker:      http://localhost:3000/health-worker"
echo "   • Specialist Portal:  http://localhost:3000/specialist"
echo ""
echo "Press Ctrl+C to stop both servers..."

# Function to handle cleanup
cleanup() {
    echo ""
    echo "🛑 Shutting down VitalSense Pro..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Application stopped"
    exit 0
}

# Set up trap for cleanup
trap cleanup INT TERM

# Wait for processes
wait 