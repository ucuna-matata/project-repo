"""
Test script for AI CV Generation

This script tests the AI CV generation functionality.
"""

import os
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from profiles.services.cv_ai_service import generate_cv_content, enhance_cv_section

def test_cv_generation():
    """Test CV content generation"""
    print("=" * 60)
    print("Testing AI CV Generation")
    print("=" * 60)

    # Sample profile data
    profile_data = {
        'full_name': 'Олександр Петренко',
        'email': 'alex.petrenko@example.com',
        'experience': [
            {
                'title': 'Full Stack Developer',
                'company': 'Tech Solutions',
                'start': '01/2022',
                'end': 'Present',
                'description': 'Working on web applications'
            },
            {
                'title': 'Junior Developer',
                'company': 'StartupXYZ',
                'start': '06/2020',
                'end': '12/2021',
                'description': 'Developed features for mobile app'
            }
        ],
        'education': [
            {
                'degree': 'Bachelor in Computer Science',
                'institution': 'Київський Політехнічний Інститут',
                'year': '2020',
                'description': 'Focused on software engineering'
            }
        ],
        'skills': [
            {'name': 'Python', 'level': 'Advanced'},
            {'name': 'JavaScript', 'level': 'Advanced'},
            {'name': 'React', 'level': 'Intermediate'},
            {'name': 'Django', 'level': 'Advanced'},
            {'name': 'PostgreSQL', 'level': 'Intermediate'}
        ],
        'projects': [
            {
                'title': 'E-commerce Platform',
                'description': 'Built online store',
                'tech': 'Django, React, PostgreSQL',
                'link': 'https://github.com/example'
            }
        ],
        'summary': 'Experienced developer',
        'links': {
            'github': 'https://github.com/oleksandr',
            'linkedin': 'https://linkedin.com/in/oleksandr'
        }
    }

    # Optional job description
    job_description = """
    We are looking for a Senior Full Stack Developer with experience in:
    - Python and Django
    - React and modern JavaScript
    - RESTful API design
    - Database design and optimization
    - Agile development practices
    """

    print("\n📝 Profile Data:")
    print(f"  Name: {profile_data['full_name']}")
    print(f"  Experience entries: {len(profile_data['experience'])}")
    print(f"  Skills: {len(profile_data['skills'])}")
    print(f"  Projects: {len(profile_data['projects'])}")

    if job_description:
        print(f"\n🎯 Target job: Senior Full Stack Developer")

    print("\n🤖 Generating CV content with AI...")

    try:
        result = generate_cv_content(profile_data, job_description)

        if 'error' in result:
            print(f"\n❌ Error: {result['error']}")
            if 'message' in result:
                print(f"   Message: {result['message']}")
            return False

        print("\n✓ CV generated successfully!")

        # Display results
        if 'summary' in result:
            print("\n📊 Professional Summary:")
            print(f"  {result['summary']}")

        if 'experience' in result and len(result['experience']) > 0:
            print(f"\n💼 Enhanced Experience ({len(result['experience'])} entries):")
            for exp in result['experience'][:2]:  # Show first 2
                print(f"\n  • {exp.get('title', 'N/A')} at {exp.get('company', 'N/A')}")
                print(f"    {exp.get('description', 'N/A')[:150]}...")

        if 'skills' in result:
            print(f"\n🛠️  Skills organized by category:")
            skills_data = result['skills']
            if isinstance(skills_data, dict):
                for category, skills in skills_data.items():
                    print(f"    {category.title()}: {', '.join(skills[:5])}")
            else:
                print(f"    {len(skills_data)} skills listed")

        if 'projects' in result and len(result['projects']) > 0:
            print(f"\n🚀 Projects ({len(result['projects'])}):")
            for proj in result['projects'][:2]:
                print(f"  • {proj.get('title', 'N/A')}")

        return True

    except Exception as e:
        print(f"\n❌ Error generating CV: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_section_enhancement():
    """Test enhancing a specific CV section"""
    print("\n" + "=" * 60)
    print("Testing Section Enhancement")
    print("=" * 60)

    section_name = "experience"
    current_content = "Worked on web applications using Django and React"
    context = "Senior Full Stack Developer position"

    print(f"\n📝 Section: {section_name}")
    print(f"  Original: {current_content}")
    print(f"  Context: {context}")

    print("\n🤖 Enhancing with AI...")

    try:
        enhanced = enhance_cv_section(section_name, current_content, context)

        print("\n✓ Enhanced successfully!")
        print(f"\n📊 Enhanced content:")
        print(f"  {enhanced}")

        return True

    except Exception as e:
        print(f"\n❌ Error: {e}")
        return False


def main():
    print("\n" + "🎨 AI CV Generator Test Suite" + "\n")

    results = []

    # Test 1: Full CV Generation
    results.append(("CV Generation", test_cv_generation()))

    # Test 2: Section Enhancement
    results.append(("Section Enhancement", test_section_enhancement()))

    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)

    for test_name, passed in results:
        status = "✓ PASSED" if passed else "❌ FAILED"
        print(f"{test_name}: {status}")

    total_passed = sum(1 for _, passed in results if passed)
    total_tests = len(results)
    print(f"\nTotal: {total_passed}/{total_tests} tests passed")

    if total_passed == total_tests:
        print("\n🎉 All tests passed! AI CV generator is ready to use.")
    else:
        print("\n⚠️  Some tests failed. Please check the configuration.")
        print("\nTroubleshooting:")
        print("1. Make sure GROQ_API_KEY is set in .env file")
        print("2. Check that the Groq API is accessible")
        print("3. Verify the model name is correct (llama-3.3-70b-versatile)")


if __name__ == "__main__":
    main()

