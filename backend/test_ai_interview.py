"""
Test script for AI Interview Assistant

This script tests the AI functionality without requiring a full Django server.
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

from interview.llama_api import get_ai_hint, client

def test_groq_connection():
    """Test if Groq API key is configured and working"""
    print("=" * 60)
    print("Testing Groq API Connection")
    print("=" * 60)

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        print("❌ GROQ_API_KEY not found in environment")
        print("Please add it to your .env file")
        return False

    print(f"✓ GROQ_API_KEY found: {api_key[:20]}...")

    if not client:
        print("❌ Groq client failed to initialize")
        return False

    print("✓ Groq client initialized successfully")
    return True

def test_ai_hint():
    """Test AI hint generation"""
    print("\n" + "=" * 60)
    print("Testing AI Hint Generation")
    print("=" * 60)

    question = "Explain the difference between let, const, and var in JavaScript."
    current_answer = "let and const are block scoped"

    print(f"\nQuestion: {question}")
    print(f"Current Answer: {current_answer}")
    print("\nGenerating hint...")

    try:
        hint = get_ai_hint(question, current_answer)
        print(f"\n✓ AI Hint generated successfully:")
        print(f"📝 {hint}")
        return True
    except Exception as e:
        print(f"❌ Error generating hint: {e}")
        return False

def test_interview_feedback():
    """Test interview feedback generation"""
    print("\n" + "=" * 60)
    print("Testing Interview Feedback Generation")
    print("=" * 60)

    from interview.llama_api import generate_interview_feedback
    from interview.models import InterviewSession
    from django.contrib.auth import get_user_model

    User = get_user_model()

    # Create a mock session object
    class MockSession:
        def __init__(self):
            self.questions = [
                {
                    'id': 'fe1',
                    'text': 'Explain the difference between let, const, and var in JavaScript.',
                    'category': 'JavaScript',
                    'expected_points': ['block scope', 'hoisting', 'reassignment']
                },
                {
                    'id': 'fe2',
                    'text': 'What is the Virtual DOM and how does it work in React?',
                    'category': 'React',
                    'expected_points': ['diffing algorithm', 'performance', 'reconciliation']
                }
            ]
            self.answers = [
                {
                    'question_id': 'fe1',
                    'text': 'let and const are block scoped while var is function scoped. const cannot be reassigned.',
                    'time_spent': 120
                },
                {
                    'question_id': 'fe2',
                    'text': 'Virtual DOM is a lightweight copy of the real DOM. React uses it to compare changes and update only what changed.',
                    'time_spent': 150
                }
            ]

    mock_session = MockSession()

    print("\nGenerating feedback for mock interview session...")

    try:
        feedback = generate_interview_feedback(mock_session)

        print("\n✓ Feedback generated successfully:")
        print("\n📊 Strengths:")
        for i, strength in enumerate(feedback.get('strengths', []), 1):
            print(f"  {i}. {strength}")

        print("\n⚠️  Weaknesses:")
        for i, weakness in enumerate(feedback.get('weaknesses', []), 1):
            print(f"  {i}. {weakness}")

        print("\n💡 Tips:")
        for i, tip in enumerate(feedback.get('tips', []), 1):
            print(f"  {i}. {tip}")

        print(f"\n📝 Overall Assessment:")
        print(f"  {feedback.get('overall_assessment', 'N/A')}")

        return True
    except Exception as e:
        print(f"❌ Error generating feedback: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("\n" + "🤖 AI Interview Assistant Test Suite" + "\n")

    results = []

    # Test 1: Connection
    results.append(("Groq Connection", test_groq_connection()))

    # Test 2: Hint Generation (only if connection works)
    if results[0][1]:
        results.append(("AI Hint", test_ai_hint()))
        results.append(("Interview Feedback", test_interview_feedback()))
    else:
        print("\n⚠️  Skipping AI tests due to connection failure")

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
        print("\n🎉 All tests passed! AI assistant is ready to use.")
    else:
        print("\n⚠️  Some tests failed. Please check the configuration.")

if __name__ == "__main__":
    main()

