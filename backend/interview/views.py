from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import InterviewSession
from .serializers import InterviewSessionSerializer, InterviewSessionCreateSerializer, InterviewAnswerSerializer
from authz.models import AuditEvent


# Question bank for different topics
QUESTION_BANK = {
    'frontend-basics': [
        {'id': 'fe1', 'text': 'Explain the difference between let, const, and var in JavaScript.', 'category': 'JavaScript', 'expected_points': ['block scope', 'hoisting', 'reassignment']},
        {'id': 'fe2', 'text': 'What is the Virtual DOM and how does it work in React?', 'category': 'React', 'expected_points': ['diffing algorithm', 'performance', 'reconciliation']},
        {'id': 'fe3', 'text': 'Describe the CSS Box Model.', 'category': 'CSS', 'expected_points': ['content', 'padding', 'border', 'margin']},
        {'id': 'fe4', 'text': 'What are React Hooks and why were they introduced?', 'category': 'React', 'expected_points': ['state', 'lifecycle', 'functional components']},
        {'id': 'fe5', 'text': 'Explain event delegation in JavaScript.', 'category': 'JavaScript', 'expected_points': ['bubbling', 'event target', 'performance']},
        {'id': 'fe6', 'text': 'What is the purpose of useEffect hook?', 'category': 'React', 'expected_points': ['side effects', 'dependencies', 'cleanup']},
        {'id': 'fe7', 'text': 'Describe different ways to center a div in CSS.', 'category': 'CSS', 'expected_points': ['flexbox', 'grid', 'position']},
        {'id': 'fe8', 'text': 'What is the difference between == and === in JavaScript?', 'category': 'JavaScript', 'expected_points': ['type coercion', 'strict equality']},
    ],
    'backend-basics': [
        {'id': 'be1', 'text': 'Explain the difference between SQL and NoSQL databases.', 'category': 'Databases', 'expected_points': ['schema', 'scalability', 'use cases']},
        {'id': 'be2', 'text': 'What is RESTful API design?', 'category': 'API', 'expected_points': ['HTTP methods', 'stateless', 'resources']},
        {'id': 'be3', 'text': 'Describe the concept of middleware in web frameworks.', 'category': 'Architecture', 'expected_points': ['request/response', 'chain', 'cross-cutting concerns']},
        {'id': 'be4', 'text': 'What is database indexing and why is it important?', 'category': 'Databases', 'expected_points': ['performance', 'query optimization', 'trade-offs']},
        {'id': 'be5', 'text': 'Explain authentication vs authorization.', 'category': 'Security', 'expected_points': ['identity', 'permissions', 'tokens']},
    ],
    'algorithms': [
        {'id': 'alg1', 'text': 'Explain the difference between O(n) and O(log n) time complexity with examples.', 'category': 'Complexity', 'expected_points': ['linear', 'logarithmic', 'examples']},
        {'id': 'alg2', 'text': 'Describe how a hash table works.', 'category': 'Data Structures', 'expected_points': ['hashing', 'collisions', 'lookup time']},
        {'id': 'alg3', 'text': 'What is the difference between BFS and DFS?', 'category': 'Graph', 'expected_points': ['queue', 'stack', 'use cases']},
        {'id': 'alg4', 'text': 'Explain dynamic programming with an example.', 'category': 'Techniques', 'expected_points': ['memoization', 'optimal substructure', 'example']},
        {'id': 'alg5', 'text': 'Describe the binary search algorithm.', 'category': 'Search', 'expected_points': ['sorted array', 'divide and conquer', 'complexity']},
    ],
}


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_interview_session(request):
    """Create a new interview session with questions."""
    serializer = InterviewSessionCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    topic = serializer.validated_data['topic']
    questions = QUESTION_BANK.get(topic, QUESTION_BANK['frontend-basics'])[:5]

    session = InterviewSession.objects.create(
        user=request.user,
        questions=questions,
        status='in_progress'
    )

    response_serializer = InterviewSessionSerializer(session)
    return Response(response_serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_interview_sessions(request):
    """List all interview sessions for the user."""
    sessions = InterviewSession.objects.filter(user=request.user)
    serializer = InterviewSessionSerializer(sessions, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_interview_session(request, session_id):
    """Get details of a specific interview session."""
    session = get_object_or_404(InterviewSession, id=session_id, user=request.user)
    serializer = InterviewSessionSerializer(session)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def save_interview_answer(request, session_id):
    """Save or update an answer during the interview."""
    session = get_object_or_404(InterviewSession, id=session_id, user=request.user, status='in_progress')

    serializer = InterviewAnswerSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    question_id = serializer.validated_data['question_id']
    answer_text = serializer.validated_data['text']
    time_spent = serializer.validated_data['time_spent']

    # Update or add answer
    answers = session.answers or []
    existing_answer = next((a for a in answers if a['question_id'] == question_id), None)

    if existing_answer:
        existing_answer['text'] = answer_text
        existing_answer['time_spent'] = time_spent
    else:
        answers.append({
            'question_id': question_id,
            'text': answer_text,
            'time_spent': time_spent
        })

    session.answers = answers
    session.save()

    return Response(InterviewSessionSerializer(session).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_interview(request, session_id):
    """Submit the interview and calculate score."""
    session = get_object_or_404(InterviewSession, id=session_id, user=request.user, status='in_progress')

    # Mark as completed
    session.status = 'completed'
    session.ended_at = timezone.now()
    session.duration_sec = int((session.ended_at - session.started_at).total_seconds())

    # Calculate score (simple rubric-based for MVP)
    total_questions = len(session.questions)
    answered_questions = len(session.answers or [])

    # Basic scoring: 10 points per question answered, bonus for length
    base_score = (answered_questions / total_questions) * 70 if total_questions > 0 else 0

    # Bonus for answer quality (simple length check for MVP)
    quality_score = 0
    for answer in (session.answers or []):
        if len(answer.get('text', '')) > 50:
            quality_score += 30 / total_questions if total_questions > 0 else 0

    session.score = min(100, base_score + quality_score)

    # Generate checklist
    session.checklist = [
        {'criterion': 'All questions answered', 'passed': answered_questions == total_questions},
        {'criterion': 'Average answer length > 50 chars', 'passed': quality_score > 15},
        {'criterion': 'Completed within reasonable time', 'passed': session.duration_sec < 1800},  # 30 min
    ]

    # Generate AI feedback using Groq
    try:
        from .llama_api import generate_interview_feedback
        overall_feedback, detailed_review = generate_interview_feedback(session)
        session.ai_feedback = overall_feedback
        session.detailed_review = detailed_review
    except Exception as e:
        print(f"Warning: Failed to generate AI feedback: {e}")
        session.ai_feedback = {
            'strengths': ['Completed the interview'],
            'weaknesses': ['AI feedback not available'],
            'tips': ['Practice explaining concepts with real-world examples'],
            'overall_assessment': 'Unable to generate detailed feedback at this time.',
            'recommendation': 'Please try again or contact support.'
        }
        session.detailed_review = []

    session.save()

    # Create audit event
    AuditEvent.objects.create(
        user=request.user,
        type='interview_complete',
        payload={'session_id': str(session.id), 'score': float(session.score)}
    )

    return Response(InterviewSessionSerializer(session).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_ai_hint(request, session_id):
    """Get an AI hint for the current question."""
    session = get_object_or_404(InterviewSession, id=session_id, user=request.user, status='in_progress')

    question_id = request.data.get('question_id')
    current_answer = request.data.get('current_answer', '')

    if not question_id:
        return Response({'error': 'question_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Find the question
    question = next((q for q in session.questions if q['id'] == question_id), None)
    if not question:
        return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)

    # Get AI hint
    try:
        from .llama_api import get_ai_hint as generate_hint
        hint = generate_hint(question['text'], current_answer)
        return Response({'hint': hint})
    except Exception as e:
        print(f"Error generating hint: {e}")
        return Response({
            'hint': 'Consider the key concepts related to this topic. Break down the question into smaller parts.'
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def retake_interview(request, session_id):
    """Create a new interview session based on a completed one (retake)."""
    original_session = get_object_or_404(InterviewSession, id=session_id, user=request.user)

    if original_session.status != 'completed':
        return Response(
            {'error': 'Can only retake completed interviews'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not original_session.can_retake:
        return Response(
            {'error': 'This interview cannot be retaken'},
            status=status.HTTP_403_FORBIDDEN
        )

    # Create new session with same questions (or similar ones)
    # You can optionally shuffle or select different questions from the same topic
    new_session = InterviewSession.objects.create(
        user=request.user,
        questions=original_session.questions,  # Use same questions for practice
        status='in_progress'
    )

    # Create audit event
    AuditEvent.objects.create(
        user=request.user,
        type='interview_retake',
        payload={
            'original_session_id': str(original_session.id),
            'new_session_id': str(new_session.id)
        }
    )

    response_serializer = InterviewSessionSerializer(new_session)
    return Response(response_serializer.data, status=status.HTTP_201_CREATED)

