from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import TrainerResult
from .serializers import TrainerResultSerializer, TrainerAttemptSerializer, TrainerSubmitSerializer
from authz.models import AuditEvent


# Quiz question bank
QUIZ_BANK = {
    'frontend-basics': [
        {'id': 'q1', 'text': 'What does HTML stand for?', 'options': ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'], 'correct': 0},
        {'id': 'q2', 'text': 'Which CSS property controls the text size?', 'options': ['font-size', 'text-size', 'font-style', 'text-style'], 'correct': 0},
        {'id': 'q3', 'text': 'Which JavaScript keyword declares a block-scoped variable?', 'options': ['var', 'let', 'const', 'function'], 'correct': 1},
        {'id': 'q4', 'text': 'What is the correct syntax for referring to an external script?', 'options': ['<script href="xxx.js">', '<script name="xxx.js">', '<script src="xxx.js">', '<script file="xxx.js">'], 'correct': 2},
        {'id': 'q5', 'text': 'Which HTML tag is used to define an internal style sheet?', 'options': ['<style>', '<css>', '<script>', '<styles>'], 'correct': 0},
        {'id': 'q6', 'text': 'Which property is used to change the background color?', 'options': ['color', 'background-color', 'bgcolor', 'bg-color'], 'correct': 1},
        {'id': 'q7', 'text': 'How do you create a function in JavaScript?', 'options': ['function myFunction()', 'function:myFunction()', 'function = myFunction()', 'def myFunction()'], 'correct': 0},
        {'id': 'q8', 'text': 'Which operator is used to assign a value to a variable?', 'options': ['*', '=', '-', 'x'], 'correct': 1},
        {'id': 'q9', 'text': 'What is the correct way to write a JavaScript array?', 'options': ['var colors = "red", "green", "blue"', 'var colors = (1:"red", 2:"green", 3:"blue")', 'var colors = ["red", "green", "blue"]', 'var colors = 1 = "red", 2 = "green", 3 = "blue"'], 'correct': 2},
        {'id': 'q10', 'text': 'Which event occurs when the user clicks on an HTML element?', 'options': ['onchange', 'onclick', 'onmouseclick', 'onmouseover'], 'correct': 1},
    ],
    'backend-basics': [
        {'id': 'q1', 'text': 'What does SQL stand for?', 'options': ['Structured Query Language', 'Simple Question Language', 'Strong Query Language', 'Structured Question Language'], 'correct': 0},
        {'id': 'q2', 'text': 'Which HTTP method is used to retrieve data?', 'options': ['POST', 'GET', 'PUT', 'DELETE'], 'correct': 1},
        {'id': 'q3', 'text': 'What is the default port for HTTPS?', 'options': ['80', '443', '8080', '3000'], 'correct': 1},
        {'id': 'q4', 'text': 'Which status code indicates a successful HTTP request?', 'options': ['404', '500', '200', '301'], 'correct': 2},
        {'id': 'q5', 'text': 'What does REST stand for?', 'options': ['Representational State Transfer', 'Remote State Transfer', 'Reliable State Transfer', 'Resource State Transfer'], 'correct': 0},
        {'id': 'q6', 'text': 'Which database is a NoSQL database?', 'options': ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'], 'correct': 2},
        {'id': 'q7', 'text': 'What is the purpose of an API?', 'options': ['To store data', 'To allow applications to communicate', 'To style websites', 'To compile code'], 'correct': 1},
        {'id': 'q8', 'text': 'Which HTTP header is used for authentication?', 'options': ['Content-Type', 'Authorization', 'Accept', 'User-Agent'], 'correct': 1},
        {'id': 'q9', 'text': 'What does ORM stand for?', 'options': ['Object Resource Management', 'Object Relational Mapping', 'Online Resource Manager', 'Operational Resource Model'], 'correct': 1},
        {'id': 'q10', 'text': 'Which method is idempotent in REST?', 'options': ['POST', 'GET', 'PATCH', 'All of the above'], 'correct': 1},
    ],
    'algorithms': [
        {'id': 'q1', 'text': 'What is the time complexity of binary search?', 'options': ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'], 'correct': 1},
        {'id': 'q2', 'text': 'Which data structure uses LIFO?', 'options': ['Queue', 'Stack', 'Tree', 'Graph'], 'correct': 1},
        {'id': 'q3', 'text': 'What is the worst-case time complexity of quicksort?', 'options': ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], 'correct': 2},
        {'id': 'q4', 'text': 'Which algorithm is used for finding the shortest path?', 'options': ['Bubble Sort', 'Dijkstra', 'Binary Search', 'Merge Sort'], 'correct': 1},
        {'id': 'q5', 'text': 'What does BFS stand for?', 'options': ['Best First Search', 'Breadth First Search', 'Binary File System', 'Bounded First Search'], 'correct': 1},
        {'id': 'q6', 'text': 'Which data structure is used in BFS?', 'options': ['Stack', 'Queue', 'Tree', 'Heap'], 'correct': 1},
        {'id': 'q7', 'text': 'What is the space complexity of recursion?', 'options': ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], 'correct': 1},
        {'id': 'q8', 'text': 'Which sorting algorithm is stable?', 'options': ['Quicksort', 'Heapsort', 'Merge Sort', 'Selection Sort'], 'correct': 2},
        {'id': 'q9', 'text': 'What is the time complexity of accessing an element in a hash table (average case)?', 'options': ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'], 'correct': 2},
        {'id': 'q10', 'text': 'Which tree is always balanced?', 'options': ['Binary Search Tree', 'AVL Tree', 'Binary Tree', 'N-ary Tree'], 'correct': 1},
    ],
}


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_trainer_attempt(request):
    """Start a new trainer quiz attempt."""
    serializer = TrainerAttemptSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    module_key = serializer.validated_data['module_key']
    questions = QUIZ_BANK.get(module_key, QUIZ_BANK['frontend-basics'])

    # Return questions without correct answers
    safe_questions = [
        {'id': q['id'], 'text': q['text'], 'options': q['options']}
        for q in questions
    ]

    return Response({
        'module_key': module_key,
        'questions': safe_questions,
        'total_questions': len(questions),
        'max_score': 100
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_trainer_attempt(request):
    """Submit trainer quiz answers and calculate score."""
    serializer = TrainerSubmitSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    module_key = request.data.get('module_key')
    answers = serializer.validated_data['answers']
    time_taken = serializer.validated_data.get('time_taken', 0)

    # Get correct answers
    questions = QUIZ_BANK.get(module_key, QUIZ_BANK['frontend-basics'])
    correct_answers = {q['id']: q['correct'] for q in questions}

    # Calculate score
    correct_count = 0
    total_questions = len(questions)

    for answer in answers:
        question_id = answer.get('question_id')
        selected_option = answer.get('selected_option')

        if question_id in correct_answers and selected_option == correct_answers[question_id]:
            correct_count += 1

    score = (correct_count / total_questions * 100) if total_questions > 0 else 0

    # Count previous attempts
    previous_attempts = TrainerResult.objects.filter(
        user=request.user,
        module_key=module_key
    ).count()

    # Save result
    result = TrainerResult.objects.create(
        user=request.user,
        module_key=module_key,
        attempts=previous_attempts + 1,
        score=score,
        max_score=100,
        metadata={
            'correct_count': correct_count,
            'total_questions': total_questions,
            'time_taken': time_taken,
            'answers': answers
        }
    )

    # Create audit event
    AuditEvent.objects.create(
        user=request.user,
        type='trainer_complete',
        payload={
            'result_id': str(result.id),
            'module_key': module_key,
            'score': float(score),
            'attempt': result.attempts
        }
    )

    return Response(TrainerResultSerializer(result).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_trainer_results(request):
    """List all trainer results for the user."""
    results = TrainerResult.objects.filter(user=request.user)
    serializer = TrainerResultSerializer(results, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_trainer_result(request, result_id):
    """Get details of a specific trainer result."""
    result = get_object_or_404(TrainerResult, id=result_id, user=request.user)
    serializer = TrainerResultSerializer(result)
    return Response(serializer.data)

