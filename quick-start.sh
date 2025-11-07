#!/bin/bash

# Vector B - Quick Start Script
# This script helps you set up the project quickly

set -e

echo "🚀 Vector B - Quick Start Setup"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi
echo -e "${GREEN}✅ Docker found${NC}"

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi
echo -e "${GREEN}✅ Docker Compose found${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js not found (optional for local development)${NC}"
else
    echo -e "${GREEN}✅ Node.js found${NC}"
fi

if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}⚠️  Python3 not found (optional for local development)${NC}"
else
    echo -e "${GREEN}✅ Python3 found${NC}"
fi

echo ""
echo "📝 Setting up environment files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env..."
    cat > backend/.env << 'EOF'
SECRET_KEY=dev-secret-key-change-in-production-$(openssl rand -hex 32)
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
WEB_ORIGIN=http://localhost:5173

# Google OAuth (REQUIRED - Get from https://console.cloud.google.com)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# LLM (Optional - for AI features)
LLM_PROVIDER_URL=https://api.openai.com/v1
LLM_API_KEY=your-openai-api-key-here
LLM_MODEL=gpt-3.5-turbo

STORAGE_BACKEND=local
EOF
    echo -e "${GREEN}✅ Created backend/.env${NC}"
    echo -e "${YELLOW}⚠️  Please edit backend/.env and add your Google OAuth credentials${NC}"
else
    echo -e "${GREEN}✅ backend/.env already exists${NC}"
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
    echo "Creating frontend/.env..."
    cat > frontend/.env << 'EOF'
VITE_API_URL=http://localhost:8000
EOF
    echo -e "${GREEN}✅ Created frontend/.env${NC}"
else
    echo -e "${GREEN}✅ frontend/.env already exists${NC}"
fi

echo ""
echo "🎯 Choose how to run the project:"
echo "1) Docker Compose (recommended, easiest)"
echo "2) Local development (backend + frontend separately)"
echo "3) Skip and show instructions"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🐳 Starting with Docker Compose..."
        echo "This will build and start all services (database, backend, frontend)"
        echo ""

        # Check if Google OAuth is configured
        if grep -q "your-google-client-id-here" backend/.env; then
            echo -e "${RED}⚠️  WARNING: Google OAuth not configured!${NC}"
            echo "Please edit backend/.env and add your Google credentials"
            echo "Then run: docker-compose up --build"
            exit 1
        fi

        docker-compose up --build
        ;;
    2)
        echo ""
        echo "💻 Local Development Setup"
        echo ""

        # Backend setup
        echo "Setting up backend..."
        cd backend
        if [ ! -d "venv" ]; then
            echo "Creating Python virtual environment..."
            python3 -m venv venv
        fi

        echo "Activating virtual environment..."
        source venv/bin/activate

        echo "Installing Python dependencies..."
        pip install -r requirements.txt

        echo "Running database migrations..."
        python manage.py migrate

        echo ""
        echo -e "${GREEN}✅ Backend setup complete${NC}"
        echo ""
        echo "To start backend: cd backend && source venv/bin/activate && python manage.py runserver"
        echo ""

        cd ..

        # Frontend setup
        echo "Setting up frontend..."
        cd frontend

        if [ ! -d "node_modules" ]; then
            echo "Installing npm dependencies..."
            npm install
        fi

        echo ""
        echo -e "${GREEN}✅ Frontend setup complete${NC}"
        echo ""
        echo "To start frontend: cd frontend && npm run dev"
        echo ""

        cd ..

        echo ""
        echo -e "${GREEN}🎉 Setup complete!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Edit backend/.env with your Google OAuth credentials"
        echo "2. Open two terminals:"
        echo "   Terminal 1: cd backend && source venv/bin/activate && python manage.py runserver"
        echo "   Terminal 2: cd frontend && npm run dev"
        echo "3. Visit http://localhost:5173"
        ;;
    3)
        echo ""
        echo "📚 Setup Instructions:"
        echo ""
        echo "1. Configure Google OAuth:"
        echo "   - Go to https://console.cloud.google.com/"
        echo "   - Create OAuth 2.0 credentials"
        echo "   - Add redirect URI: http://localhost:8000/api/auth/google/callback"
        echo "   - Copy Client ID and Secret to backend/.env"
        echo ""
        echo "2. Start with Docker:"
        echo "   docker-compose up --build"
        echo ""
        echo "3. Or run locally:"
        echo "   Backend: cd backend && source venv/bin/activate && python manage.py runserver"
        echo "   Frontend: cd frontend && npm run dev"
        echo ""
        echo "4. Visit: http://localhost:5173"
        echo ""
        echo "For more details, see GETTING_STARTED.md"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Done!${NC}"

