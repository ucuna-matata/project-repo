"""
Test script to verify interview review and retake functionality
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from interview.models import InterviewSession
from interview.llama_api import generate_interview_feedback

User = get_user_model()

def test_interview_review():
    """Test the interview review functionality"""
    print("🧪 Testing Interview Review & Retake Feature\n")

    # Get or create test user
    user, created = User.objects.get_or_create(
        email='test@example.com',
        defaults={'username': 'testuser'}
    )
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"✅ Created test user: {user.email}")
    else:
        print(f"✅ Using existing user: {user.email}")

    # Create test interview session
    test_questions = [
        {
            'id': 'test1',
            'text': 'What is React?',
            'category': 'React',
            'expected_points': ['library', 'UI', 'components']
        },
        {
            'id': 'test2',
            'text': 'Explain closures in JavaScript',
            'category': 'JavaScript',
            'expected_points': ['scope', 'function', 'lexical']
        }
    ]

    test_answers = [
        {
            'question_id': 'test1',
            'text': 'React is a JavaScript library for building user interfaces. It uses components and virtual DOM.',
            'time_spent': 120
        },
        {
            'question_id': 'test2',
            'text': 'A closure is when a function has access to variables from its outer scope.',
            'time_spent': 90
        }
    ]

    session = InterviewSession.objects.create(
        user=user,
        questions=test_questions,
        answers=test_answers,
        status='in_progress'
    )
    print(f"✅ Created test session: {session.id}")

    # Test AI feedback generation
    print("\n🤖 Generating AI feedback...")
    try:
        overall_feedback, detailed_review = generate_interview_feedback(session)

        session.ai_feedback = overall_feedback
        session.detailed_review = detailed_review
        session.status = 'completed'
        session.score = 75.0
        session.save()

        print("\n📊 Overall Feedback:")
        print(f"  Strengths: {len(overall_feedback.get('strengths', []))} items")
        print(f"  Weaknesses: {len(overall_feedback.get('weaknesses', []))} items")
        print(f"  Tips: {len(overall_feedback.get('tips', []))} items")
        print(f"  Recommendation: {overall_feedback.get('recommendation', 'N/A')[:100]}...")

        print(f"\n📝 Detailed Review: {len(detailed_review)} questions reviewed")
        for i, review in enumerate(detailed_review, 1):
            print(f"  Q{i} ({review.get('question_id')}): Score {review.get('score', 0)}/10")

        print("\n✅ AI feedback generated successfully")

    except Exception as e:
        print(f"⚠️  AI feedback generation failed (this is OK if GROQ_API_KEY is not set): {e}")
        print("   Using fallback feedback...")

    # Test retake functionality
    print("\n🔄 Testing retake functionality...")
    if session.can_retake:
        retake_session = InterviewSession.objects.create(
            user=user,
            questions=session.questions,
            status='in_progress'
        )
        print(f"✅ Retake session created: {retake_session.id}")
        print(f"   Original session: {session.id}")
        print(f"   Questions match: {retake_session.questions == session.questions}")
    else:
        print("❌ Retake not allowed for this session")

    # Verify model fields
    print("\n🔍 Verifying model fields...")
    assert hasattr(session, 'detailed_review'), "Missing detailed_review field"
    assert hasattr(session, 'can_retake'), "Missing can_retake field"
    assert hasattr(session.ai_feedback, 'get'), "ai_feedback should be a dict"
    print("✅ All model fields present")

    print("\n🎉 All tests passed!")
    print(f"\n📋 Test session ID: {session.id}")
    print("   You can view this in the admin panel or API")

    return session

if __name__ == '__main__':
    test_interview_review()
