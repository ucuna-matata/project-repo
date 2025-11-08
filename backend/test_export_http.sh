#!/bin/bash
# Test CV export via HTTP

echo "🧪 Testing CV Export via HTTP"
echo ""

# Get the CV ID from the database
CV_ID=$(python3 -c "
import os, sys, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath('.')))
django.setup()
from profiles.models import CV
cv = CV.objects.first()
if cv:
    print(cv.id)
")

if [ -z "$CV_ID" ]; then
    echo "❌ No CV found in database"
    exit 1
fi

echo "✅ Found CV ID: $CV_ID"
echo ""

# First, we need to login to get session cookie
echo "📝 Logging in..."
LOGIN_RESPONSE=$(curl -s -c /tmp/cookies.txt -X POST http://localhost:8000/api/auth/login/ \
    -H "Content-Type: application/json" \
    -d '{"email":"partumyt@gmail.com","password":"test123"}')

echo "Login response: $LOGIN_RESPONSE"
echo ""

# Test PDF export
echo "📄 Testing PDF export..."
curl -v -b /tmp/cookies.txt \
    "http://localhost:8000/api/cvs/$CV_ID/export/?format=pdf" \
    -o /tmp/test_export.pdf 2>&1 | grep -E "(HTTP|Content-Type|Content-Disposition|Content-Length)"

if [ -f /tmp/test_export.pdf ]; then
    SIZE=$(stat -f%z /tmp/test_export.pdf 2>/dev/null || stat -c%s /tmp/test_export.pdf 2>/dev/null)
    echo "✅ PDF downloaded: $SIZE bytes"
    file /tmp/test_export.pdf
else
    echo "❌ PDF not downloaded"
fi

echo ""

# Test DOCX export
echo "📝 Testing DOCX export..."
curl -v -b /tmp/cookies.txt \
    "http://localhost:8000/api/cvs/$CV_ID/export/?format=docx" \
    -o /tmp/test_export.docx 2>&1 | grep -E "(HTTP|Content-Type|Content-Disposition|Content-Length)"

if [ -f /tmp/test_export.docx ]; then
    SIZE=$(stat -f%z /tmp/test_export.docx 2>/dev/null || stat -c%s /tmp/test_export.docx 2>/dev/null)
    echo "✅ DOCX downloaded: $SIZE bytes"
    file /tmp/test_export.docx
else
    echo "❌ DOCX not downloaded"
fi

echo ""
echo "✅ Tests complete!"

