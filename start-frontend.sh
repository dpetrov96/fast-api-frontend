#!/bin/bash

echo "🚀 Starting FastAPI Authentication Frontend"
echo "============================================"

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: frontend/package.json not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Navigate to frontend directory
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creating .env.local file..."
    cp env.example .env.local
    echo "✅ Created .env.local with default configuration"
    echo "📝 You can edit .env.local to change the API URL if needed"
fi

echo ""
echo "🔧 Configuration:"
echo "   - Frontend URL: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo ""
echo "📋 Make sure your FastAPI backend is running on http://localhost:8000"
echo ""
echo "🎯 Starting development server..."

# Start the development server
npm run dev