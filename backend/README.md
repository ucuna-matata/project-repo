#!/bin/bash
# Backend Setup Script for Vector B

set -e

echo "🚀 Setting up Vector B Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip setuptools wheel -q

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt -q

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Django Settings
SECRET_KEY=dev-secret-key-change-in-production-$(openssl rand -hex 32)
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3

# Google OAuth (get from https://console.cloud.google.com)
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
WEB_ORIGIN=http://localhost:5173

# LLM (Optional - for CV generation)
LLM_PROVIDER_URL=https://api.openai.com/v1
LLM_API_KEY=your-openai-api-key-here
LLM_MODEL=gpt-3.5-turbo

# Storage (Optional)
STORAGE_BACKEND=local
STORAGE_ENDPOINT=
STORAGE_BUCKET=vectorb-exports
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
EOF
    echo "⚠️  Please edit .env and add your Google OAuth credentials!"
fi

# Create logs directory
mkdir -p logs

# Run migrations
echo "🗄️  Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser prompt
echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit .env and add your Google OAuth credentials"
echo "   2. Create a superuser: python manage.py createsuperuser"
echo "   3. Run the server: python manage.py runserver"
echo "   4. Run tests: pytest"
echo ""

