#!/bin/bash

# Setup script for CV export feature
echo "🚀 Setting up CV export feature..."

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo "⚠️  Warning: No virtual environment detected."
    echo "It's recommended to activate your virtual environment first."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install playwright python-docx Pillow

# Install Playwright browsers
echo "🌐 Installing Playwright browsers (Chromium)..."
playwright install chromium

# Create media directories
echo "📁 Creating media directories..."
mkdir -p media/exports
mkdir -p logs

# Set permissions
echo "🔒 Setting permissions..."
chmod -R 755 media
chmod -R 755 logs

# Test installations
echo "🧪 Testing installations..."

echo -n "Testing Playwright... "
if python -c "import playwright; print('OK')" 2>/dev/null; then
    echo "✅"
else
    echo "❌ Failed"
    exit 1
fi

echo -n "Testing python-docx... "
if python -c "import docx; print('OK')" 2>/dev/null; then
    echo "✅"
else
    echo "❌ Failed"
    exit 1
fi

echo -n "Testing Pillow... "
if python -c "from PIL import Image; print('OK')" 2>/dev/null; then
    echo "✅"
else
    echo "❌ Failed"
    exit 1
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure your .env file has STORAGE_BACKEND=local"
echo "2. Run migrations: python manage.py migrate"
echo "3. Start the server: python manage.py runserver"
echo "4. Test CV export at http://localhost:8000/api/cvs/"
echo ""
echo "For more information, see CV_EXPORT_SETUP.md"

