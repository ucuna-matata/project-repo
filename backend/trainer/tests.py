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

    def test_get_categories(self):
        """Test getting available quiz categories."""
        response = self.client.get('/api/trainer/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('categories', response.data)
        self.assertTrue(len(response.data['categories']) > 0)

    def test_get_questions(self):
        """Test getting questions for a category."""
        response = self.client.get('/api/trainer/questions/frontend-basics/?n=10')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('questions', response.data)
        self.assertEqual(len(response.data['questions']), 10)

    def test_submit_trainer_result(self):
        """Test submitting trainer quiz results."""
        submit_data = {
            'module_key': 'frontend-basics',
            'score': 8,
            'max_score': 10,
            'metadata': {
                'questions': [{'id': 'q1', 'text': 'Test question'}],
                'answers': [{'question_id': 'q1', 'selected': 0, 'correct': 0}],
                'time_taken': 300
            }
        }
        response = self.client.post('/api/trainer/submit/', submit_data, format='json')
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
            score=8,
            max_score=10,
            metadata={'correct_count': 8, 'total_questions': 10}
        )
        TrainerResult.objects.create(
            user=self.user,
            module_key='backend-basics',
            attempts=1,
            score=9,
            max_score=10,
            metadata={'correct_count': 9, 'total_questions': 10}
        )

        response = self.client.get('/api/trainer/results/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_trainer_result(self):
        """Test getting a specific trainer result."""
        result = TrainerResult.objects.create(
            user=self.user,
            module_key='algorithms',
            attempts=1,
            score=7,
            max_score=10,
            metadata={'correct_count': 7, 'total_questions': 10}
        )

        response = self.client.get(f'/api/trainer/results/{result.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(str(response.data['id']), str(result.id))
        self.assertEqual(float(response.data['score']), 7.0)

    def test_multiple_attempts_increment(self):
        """Test that attempt counter increments correctly."""
        submit_data = {
            'module_key': 'frontend-basics',
            'score': 8,
            'max_score': 10,
            'metadata': {'time_taken': 300}
        }
        
        # First attempt
        response1 = self.client.post('/api/trainer/submit/', submit_data, format='json')
        self.assertEqual(response1.data['attempts'], 1)

        # Second attempt
        response2 = self.client.post('/api/trainer/submit/', submit_data, format='json')
        self.assertEqual(response2.data['attempts'], 2)

    def test_different_module_separate_attempts(self):
        """Test that different modules have separate attempt counters."""
        # Frontend attempt
        submit_data1 = {
            'module_key': 'frontend-basics',
            'score': 8,
            'max_score': 10,
            'metadata': {'time_taken': 300}
        }
        response1 = self.client.post('/api/trainer/submit/', submit_data1, format='json')
        self.assertEqual(response1.data['attempts'], 1)

        # Backend attempt (different module)
        submit_data2 = {
            'module_key': 'backend-basics',
            'score': 9,
            'max_score': 10,
            'metadata': {'time_taken': 300}
        }
        response2 = self.client.post('/api/trainer/submit/', submit_data2, format='json')
        self.assertEqual(response2.data['attempts'], 1)  # Should also be 1

    def test_submit_result_requires_auth(self):
        """Test that submitting results requires authentication."""
        self.client.force_authenticate(user=None)
        submit_data = {
            'module_key': 'frontend-basics',
            'score': 8,
            'max_score': 10,
            'metadata': {}
        }
        response = self.client.post('/api/trainer/submit/', submit_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_results_requires_auth(self):
        """Test that listing results requires authentication."""
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/trainer/results/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
