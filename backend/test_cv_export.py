#!/usr/bin/env python
"""Test script for CV export functionality."""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from profiles.models import CV, Profile
from profiles.services.cv_export_service import CVExportService
from django.contrib.auth import get_user_model

User = get_user_model()

def test_export():
    """Test CV export to PDF and DOCX."""
    print("Testing CV Export Functionality\n" + "="*50)

    # Get or create a test user
    user, created = User.objects.get_or_create(
        email='test@example.com',
        defaults={'username': 'testuser'}
    )
    print(f"✓ User: {user.email} {'(created)' if created else '(existing)'}")

    # Create test CV with sample data
    cv_data = {
        'title': 'Test CV',
        'template_key': 'clean',
        'sections': {
            'personal': {
                'name': 'John Doe',
                'email': 'john.doe@example.com',
                'phone': '+1234567890',
                'location': 'San Francisco, CA',
                'links': {
                    'linkedin': 'https://linkedin.com/in/johndoe',
                    'github': 'https://github.com/johndoe',
                    'portfolio': 'https://johndoe.com'
                }
            },
            'summary': 'Experienced software engineer with 5+ years in full-stack development.',
            'experience': [
                {
                    'title': 'Senior Software Engineer',
                    'company': 'Tech Corp',
                    'start': '2020-01',
                    'end': '2023-12',
                    'description': 'Led development of cloud-based applications using React and Django.'
                },
                {
                    'title': 'Software Engineer',
                    'company': 'StartUp Inc',
                    'start': '2018-06',
                    'end': '2019-12',
                    'description': 'Built RESTful APIs and microservices.'
                }
            ],
            'education': [
                {
                    'degree': 'Bachelor of Science in Computer Science',
                    'institution': 'University of California',
                    'year': '2018',
                    'description': 'Focus on software engineering and algorithms.'
                }
            ],
            'skills': [
                {'name': 'Python', 'category': 'Programming Languages', 'level': 'Expert'},
                {'name': 'JavaScript', 'category': 'Programming Languages', 'level': 'Advanced'},
                {'name': 'React', 'category': 'Frontend', 'level': 'Advanced'},
                {'name': 'Django', 'category': 'Backend', 'level': 'Expert'},
                {'name': 'PostgreSQL', 'category': 'Databases', 'level': 'Advanced'},
            ],
            'projects': [
                {
                    'title': 'E-commerce Platform',
                    'description': 'Full-stack e-commerce solution with payment integration.',
                    'tech': 'React, Django, PostgreSQL, Stripe',
                    'link': 'https://github.com/johndoe/ecommerce'
                }
            ]
        }
    }

    cv, created = CV.objects.update_or_create(
        user=user,
        title='Test CV',
        defaults=cv_data
    )
    print(f"✓ CV: {cv.title} {'(created)' if created else '(updated)'}")

    # Test PDF export
    print("\nTesting PDF export...")
    try:
        pdf_buffer, pdf_filename = CVExportService.export_to_pdf(cv)
        print(f"✓ PDF generated: {pdf_filename}")
        print(f"  Size: {len(pdf_buffer.getvalue())} bytes")

        # Save to file for inspection
        output_dir = os.path.join(os.path.dirname(__file__), 'test_exports')
        os.makedirs(output_dir, exist_ok=True)
        pdf_path = os.path.join(output_dir, pdf_filename)
        with open(pdf_path, 'wb') as f:
            f.write(pdf_buffer.getvalue())
        print(f"  Saved to: {pdf_path}")
    except Exception as e:
        print(f"✗ PDF export failed: {e}")
        import traceback
        traceback.print_exc()

    # Test DOCX export
    print("\nTesting DOCX export...")
    try:
        docx_buffer, docx_filename = CVExportService.export_to_docx(cv)
        print(f"✓ DOCX generated: {docx_filename}")
        print(f"  Size: {len(docx_buffer.getvalue())} bytes")

        # Save to file for inspection
        docx_path = os.path.join(output_dir, docx_filename)
        with open(docx_path, 'wb') as f:
            f.write(docx_buffer.getvalue())
        print(f"  Saved to: {docx_path}")
    except Exception as e:
        print(f"✗ DOCX export failed: {e}")
        import traceback
        traceback.print_exc()

    print("\n" + "="*50)
    print("Test completed!")
    print(f"Check the exports in: {output_dir}")

if __name__ == '__main__':
    test_export()

