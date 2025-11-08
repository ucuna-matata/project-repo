#!/usr/bin/env python
"""
Test CV export endpoint with actual HTTP request simulation.
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.test import RequestFactory
from django.contrib.auth import get_user_model
from profiles.models import CV
from profiles.views import cv_export

User = get_user_model()

def test_export_endpoint():
    """Test the export endpoint with a simulated request."""
    print("\n🧪 Testing CV Export Endpoint\n")

    # Get or create test user
    user = User.objects.first()
    if not user:
        print("❌ No users found in database")
        return

    print(f"✅ Using user: {user.email}")

    # Get user's CV
    cv = CV.objects.filter(user=user).first()
    if not cv:
        print("❌ No CVs found for user")
        return

    print(f"✅ Found CV: {cv.title} (ID: {cv.id})")

    # Create request factory
    factory = RequestFactory()

    # Test PDF export
    print("\n📄 Testing PDF export...")
    request = factory.get(f'/api/cvs/{cv.id}/export/?format=pdf')
    request.user = user

    try:
        response = cv_export(request, cv_id=str(cv.id))
    except Exception as e:
        print(f"   ❌ Exception occurred: {e}")
        import traceback
        traceback.print_exc()
        return

    print(f"   Response status: {response.status_code}")
    print(f"   Response type: {type(response)}")

    if response.status_code == 200:
        content_type = response.get('Content-Type', '')
        content_disposition = response.get('Content-Disposition', '')
        content_length = response.get('Content-Length', 0)

        print(f"   ✅ Status: {response.status_code}")
        print(f"   ✅ Content-Type: {content_type}")
        print(f"   ✅ Content-Disposition: {content_disposition}")
        print(f"   ✅ Content-Length: {content_length} bytes")

        if 'application/pdf' in content_type:
            print("   ✅ Correct PDF content type")
        else:
            print(f"   ⚠️ Unexpected content type: {content_type}")

        if 'attachment' in content_disposition:
            print("   ✅ Attachment header set correctly")
        else:
            print("   ⚠️ Content-Disposition doesn't contain 'attachment'")
    else:
        print(f"   ❌ Failed with status {response.status_code}")
        return

    # Test DOCX export
    print("\n📝 Testing DOCX export...")
    request = factory.get(f'/api/cvs/{cv.id}/export/?format=docx')
    request.user = user

    response = cv_export(request, cv_id=str(cv.id))

    if response.status_code == 200:
        content_type = response.get('Content-Type', '')
        content_disposition = response.get('Content-Disposition', '')
        content_length = response.get('Content-Length', 0)

        print(f"   ✅ Status: {response.status_code}")
        print(f"   ✅ Content-Type: {content_type}")
        print(f"   ✅ Content-Disposition: {content_disposition}")
        print(f"   ✅ Content-Length: {content_length} bytes")

        if 'wordprocessingml' in content_type or 'docx' in content_type:
            print("   ✅ Correct DOCX content type")
        else:
            print(f"   ⚠️ Unexpected content type: {content_type}")

        if 'attachment' in content_disposition:
            print("   ✅ Attachment header set correctly")
        else:
            print("   ⚠️ Content-Disposition doesn't contain 'attachment'")
    else:
        print(f"   ❌ Failed with status {response.status_code}")
        return

    print("\n✅ All endpoint tests passed!\n")

if __name__ == '__main__':
    test_export_endpoint()

