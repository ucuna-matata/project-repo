from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import random
from .models import TrainerResult
from .serializers import TrainerResultSerializer, TrainerSubmitSerializer


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
        {'id': 'q11', 'text': 'Which HTML element is used to define important text?', 'options': ['<strong>', '<em>', '<mark>', '<b>'], 'correct': 0},
        {'id': 'q12', 'text': 'Which CSS layout module provides flexible rows or columns?', 'options': ['Grid', 'Flexbox', 'Float', 'Positioning'], 'correct': 1},
        {'id': 'q13', 'text': 'In CSS, which property creates space outside the border?', 'options': ['padding', 'margin', 'gap', 'outline'], 'correct': 1},
        {'id': 'q14', 'text': 'Which attribute is required on <img> for accessibility?', 'options': ['title', 'alt', 'aria-describedby', 'role'], 'correct': 1},
        {'id': 'q15', 'text': 'Which HTTP status code is returned for missing assets?', 'options': ['200', '301', '404', '500'], 'correct': 2},
        {'id': 'q16', 'text': 'What is the default display value for a <div>?', 'options': ['inline', 'inline-block', 'block', 'flex'], 'correct': 2},
        {'id': 'q17', 'text': 'Which meta tag helps with responsive layouts?', 'options': ['<meta charset="utf-8">', '<meta name="viewport" content="width=device-width, initial-scale=1">', '<meta name="mobile">', '<meta name="device">'], 'correct': 1},
        {'id': 'q18', 'text': 'Which CSS function applies a custom variable value?', 'options': ['var()', 'calc()', 'attr()', 'env()'], 'correct': 0},
        {'id': 'q19', 'text': 'Which CSS property controls stacking order?', 'options': ['order', 'position', 'z-index', 'priority'], 'correct': 2},
        {'id': 'q20', 'text': 'Which JS event fires when DOM is ready but images may not be?', 'options': ['load', 'DOMContentLoaded', 'ready', 'render'], 'correct': 1},
        {'id': 'q21', 'text': 'Which HTML element defines navigation links?', 'options': ['<nav>', '<menu>', '<ul>', '<section>'], 'correct': 0},
        {'id': 'q22', 'text': 'What is the correct syntax for linking external CSS?', 'options': ['<link rel="stylesheet" href="style.css">', '<style src="style.css">', '<css file="style.css">', '<script type="text/css">'], 'correct': 0},
        {'id': 'q23', 'text': 'What does `defer` attribute do in <script>?', 'options': ['Executes before parsing', 'Defers until after parsing', 'Disables script', 'Runs parallel'], 'correct': 1},
        {'id': 'q24', 'text': 'Which HTML5 feature allows local storage?', 'options': ['Cookies', 'LocalStorage', 'SessionStorage', 'Cache API'], 'correct': 1},
        {'id': 'q25', 'text': 'Which CSS unit is relative to root font size?', 'options': ['em', 'rem', 'vh', 'px'], 'correct': 1},
        {'id': 'q26', 'text': 'Which flex property aligns items along cross axis?', 'options': ['justify-content', 'align-items', 'flex-wrap', 'align-content'], 'correct': 1},
        {'id': 'q27', 'text': 'What does responsive design ensure?', 'options': ['Faster load time', 'Layout adapts to screen size', 'More colors', 'Fewer API calls'], 'correct': 1},
        {'id': 'q28', 'text': 'Which HTML element is used for semantic emphasis?', 'options': ['<b>', '<strong>', '<span>', '<i>'], 'correct': 1},
    ],

    'backend-basics': [
        {'id': 'q1', 'text': 'What does SQL stand for?', 'options': ['Structured Query Language', 'Simple Question Language', 'Strong Query Language', 'Structured Question Language'], 'correct': 0},
        {'id': 'q2', 'text': 'Which HTTP method is used to retrieve data?', 'options': ['POST', 'GET', 'PUT', 'DELETE'], 'correct': 1},
        {'id': 'q3', 'text': 'What is the default port for HTTPS?', 'options': ['80', '443', '8080', '3000'], 'correct': 1},
        {'id': 'q4', 'text': 'Which status code indicates a successful request?', 'options': ['404', '500', '200', '301'], 'correct': 2},
        {'id': 'q5', 'text': 'What does REST stand for?', 'options': ['Representational State Transfer', 'Remote State Transfer', 'Reliable State Transfer', 'Resource State Transfer'], 'correct': 0},
        {'id': 'q6', 'text': 'Which database is NoSQL?', 'options': ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'], 'correct': 2},
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
    ],

    'system-design': [
        {'id': 'q1', 'text': 'Which technique helps reduce read latency by storing frequently accessed data close to users?', 'options': ['Sharding', 'CDN caching', 'CQRS', 'Event sourcing'], 'correct': 1},
        {'id': 'q2', 'text': 'Which pattern separates read and write models for scalability?', 'options': ['Event sourcing', 'CQRS', 'Saga', 'Circuit Breaker'], 'correct': 1},
    ],

    'behavioral': [
        {'id': 'q1', 'text': 'Tell me about a time you had to learn a new technology quickly. What was the outcome?', 'options': ['I refused the task', 'I learned partially but missed deadlines', 'I created a plan, learned, and delivered value', 'I ignored the technology'], 'correct': 2},
        {'id': 'q2', 'text': 'Describe a conflict with a teammate and how you resolved it.', 'options': ['Avoided them', 'Escalated immediately', 'Sought common ground and agreed on a plan', 'Assigned blame publicly'], 'correct': 2},
    ],
}


# =========================
#  Randomized question API
# =========================

def get_random_questions(category: str, n: int = 10):
    """Повертає випадкові n питань з вказаної категорії."""
    if category not in QUIZ_BANK:
        return []
    return random.sample(QUIZ_BANK[category], min(n, len(QUIZ_BANK[category])))


@api_view(['GET'])
def get_questions(request, category):
    """API endpoint: /trainer/questions/<category>/?n=10"""
    n = int(request.GET.get('n', 10))
    questions = get_random_questions(category, n)
    if not questions:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response({'category': category, 'count': len(questions), 'questions': questions})


@api_view(['GET'])
def get_categories(request):
    """API endpoint: /trainer/categories/ — список усіх категорій."""
    return Response({'categories': list(QUIZ_BANK.keys())})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_result(request):
    """API endpoint: /trainer/submit/ — збереження результатів тесту."""
    serializer = TrainerSubmitSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    module_key = request.data.get('module_key')
    score = request.data.get('score')
    max_score = request.data.get('max_score')
    metadata = request.data.get('metadata', {})

    # Перевіряємо чи користувач вже проходив цей модуль
    previous_attempts = TrainerResult.objects.filter(
        user=request.user,
        module_key=module_key
    ).count()

    # Створюємо новий результат
    result = TrainerResult.objects.create(
        user=request.user,
        module_key=module_key,
        score=score,
        max_score=max_score,
        attempts=previous_attempts + 1,
        metadata=metadata
    )

    result_serializer = TrainerResultSerializer(result)
    return Response(result_serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_results(request):
    """API endpoint: /trainer/results/ — список всіх результатів користувача."""
    results = TrainerResult.objects.filter(user=request.user)
    serializer = TrainerResultSerializer(results, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_result(request, result_id):
    """API endpoint: /trainer/results/<result_id>/ — отримання конкретного результату."""
    try:
        result = TrainerResult.objects.get(id=result_id, user=request.user)
        serializer = TrainerResultSerializer(result)
        return Response(serializer.data)
    except TrainerResult.DoesNotExist:
        return Response({'error': 'Result not found'}, status=status.HTTP_404_NOT_FOUND)

