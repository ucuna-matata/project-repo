#!/usr/bin/env python
"""Test CV export endpoint."""
import sys
import os
import django

# Setup Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from profiles.models import CV
from profiles.services.cv_export_service import CVExportService

def test_export():
    """Test CV export service."""
    # Get first CV
    cv = CV.objects.first()

    if not cv:
        print("❌ No CVs found in database")
        return

    print(f"✅ Found CV: {cv.title} (ID: {cv.id})")
    print(f"   User: {cv.user.email}")
    print(f"   Template: {cv.template_key}")

    # Test PDF export
    try:
        pdf_buffer, pdf_filename = CVExportService.export_to_pdf(cv)
        print(f"✅ PDF export successful: {pdf_filename} ({len(pdf_buffer.getvalue())} bytes)")
    except Exception as e:
        print(f"❌ PDF export failed: {e}")
        import traceback
        traceback.print_exc()

    # Test DOCX export
    try:
        docx_buffer, docx_filename = CVExportService.export_to_docx(cv)
        print(f"✅ DOCX export successful: {docx_filename} ({len(docx_buffer.getvalue())} bytes)")
    except Exception as e:
        print(f"❌ DOCX export failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_export()

