from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import TrainerResult
from profiles.models import Profile

User = get_user_model()


class TrainerTests(TestCase):
    """Test trainer endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='trainer@example.com',
            google_sub='google123'
        )
        Profile.objects.create(user=self.user)
        self.client.force_authenticate(user=self.user)

    def test_start_trainer_attempt(self):
        """Test starting a new trainer quiz."""
        data = {'module_key': 'frontend-basics'}
        response = self.client.post('/api/trainer/start', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['module_key'], 'frontend-basics')
        self.assertTrue(len(response.data['questions']) >= 10)
        self.assertEqual(response.data['max_score'], 100)

    def test_submit_trainer_attempt(self):
        """Test submitting trainer quiz answers."""
        # First get questions
        start_data = {'module_key': 'frontend-basics'}
        start_response = self.client.post('/api/trainer/start', start_data, format='json')
        questions = start_response.data['questions']

        # Submit answers (all correct answers are at index 0, 1, or 2 based on quiz bank)
        answers = [
            {'question_id': q['id'], 'selected_option': 0}
            for q in questions
        ]

        submit_data = {
            'module_key': 'frontend-basics',
            'answers': answers,
            'time_taken': 300
        }
        response = self.client.post('/api/trainer/submit', submit_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('score', response.data)
        self.assertEqual(response.data['module_key'], 'frontend-basics')
        self.assertEqual(response.data['attempts'], 1)

    def test_list_trainer_results(self):
        """Test listing trainer results."""
        TrainerResult.objects.create(
            user=self.user,
            module_key='frontend-basics',
            attempts=1,
            score=85.0,
            max_score=100,
            metadata={'correct_count': 8, 'total_questions': 10}
        )
        TrainerResult.objects.create(
            user=self.user,
            module_key='backend-basics',
            attempts=1,
            score=90.0,
            max_score=100,
            metadata={'correct_count': 9, 'total_questions': 10}
        )

        response = self.client.get('/api/trainer/results')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_trainer_result(self):
        """Test getting a specific trainer result."""
        result = TrainerResult.objects.create(
            user=self.user,
            module_key='algorithms',
            attempts=1,
            score=75.0,
            max_score=100,
            metadata={'correct_count': 7, 'total_questions': 10}
        )

        response = self.client.get(f'/api/trainer/results/{result.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(str(response.data['id']), str(result.id))
        self.assertEqual(float(response.data['score']), 75.0)

    def test_multiple_attempts_increment(self):
        """Test that attempt counter increments correctly."""
        # First attempt
        answers1 = [{'question_id': f'q{i}', 'selected_option': 0} for i in range(1, 11)]
        submit_data1 = {
            'module_key': 'frontend-basics',
            'answers': answers1,
            'time_taken': 300
        }
        response1 = self.client.post('/api/trainer/submit', submit_data1, format='json')
        self.assertEqual(response1.data['attempts'], 1)

        # Second attempt
        submit_data2 = {
            'module_key': 'frontend-basics',
            'answers': answers1,
            'time_taken': 250
        }
        response2 = self.client.post('/api/trainer/submit', submit_data2, format='json')
        self.assertEqual(response2.data['attempts'], 2)

    def test_different_module_separate_attempts(self):
        """Test that different modules have separate attempt counters."""
        answers = [{'question_id': f'q{i}', 'selected_option': 0} for i in range(1, 11)]

        # Frontend attempt
        submit_data1 = {
            'module_key': 'frontend-basics',
            'answers': answers,
            'time_taken': 300
        }
        response1 = self.client.post('/api/trainer/submit', submit_data1, format='json')
        self.assertEqual(response1.data['attempts'], 1)

        # Backend attempt (different module)
        submit_data2 = {
            'module_key': 'backend-basics',
            'answers': answers,
            'time_taken': 300
        }
        response2 = self.client.post('/api/trainer/submit', submit_data2, format='json')
        self.assertEqual(response2.data['attempts'], 1)  # Should also be 1
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import AuditEvent, DeletionRequest
from profiles.models import Profile

User = get_user_model()


class AuthTests(TestCase):
    """Test authentication endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            full_name='Test User',
            google_sub='google123'
        )
        Profile.objects.create(user=self.user)

    def test_current_user_authenticated(self):
        """Test getting current user when authenticated."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/auth/me')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@example.com')
        self.assertIn('profile', response.data)

    def test_current_user_unauthenticated(self):
        """Test getting current user when not authenticated."""
        response = self.client.get('/api/auth/me')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logout(self):
        """Test logout functionality."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/auth/logout')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify audit event created
        audit_event = AuditEvent.objects.filter(user=self.user, type='logout').first()
        self.assertIsNotNone(audit_event)


class AuditEventTests(TestCase):
    """Test audit event creation."""

    def setUp(self):
        self.user = User.objects.create_user(
            email='audit@example.com',
            google_sub='google456'
        )

    def test_create_audit_event(self):
        """Test creating an audit event."""
        event = AuditEvent.objects.create(
            user=self.user,
            type='login',
            payload={'method': 'google_oauth'}
        )
        self.assertEqual(event.type, 'login')
        self.assertEqual(event.user, self.user)
        self.assertIsNotNone(event.ts)


class DeletionRequestTests(TestCase):
    """Test data deletion functionality."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='delete@example.com',
            google_sub='google789'
        )
        Profile.objects.create(user=self.user)

    def test_create_deletion_request(self):
        """Test creating a deletion request."""
        deletion_request = DeletionRequest.objects.create(user=self.user)
        self.assertEqual(deletion_request.status, 'pending')
        self.assertEqual(deletion_request.user, self.user)

    def test_erase_data_endpoint(self):
        """Test the erase data endpoint."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/erase')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'completed')

        # Verify user is deleted
        self.assertFalse(User.objects.filter(email='delete@example.com').exists())

