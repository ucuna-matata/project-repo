from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import InterviewSession
from profiles.models import Profile

User = get_user_model()


class InterviewTests(TestCase):
    """Test interview endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='interview@example.com',
            google_sub='google123'
        )
        Profile.objects.create(user=self.user)
        self.client.force_authenticate(user=self.user)

    def test_create_interview_session(self):
        """Test creating a new interview session."""
        data = {'topic': 'frontend-basics'}
        response = self.client.post('/api/interview/sessions', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'in_progress')
        self.assertEqual(len(response.data['questions']), 5)

    def test_list_interview_sessions(self):
        """Test listing interview sessions."""
        InterviewSession.objects.create(
            user=self.user,
            questions=[{'id': 'q1', 'text': 'Test question?'}],
            status='completed',
            score=85.5
        )

        response = self.client.get('/api/interview/sessions/list')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(float(response.data[0]['score']), 85.5)

    def test_get_interview_session(self):
        """Test getting a specific interview session."""
        session = InterviewSession.objects.create(
            user=self.user,
            questions=[{'id': 'q1', 'text': 'Test question?'}],
            status='in_progress'
        )

        response = self.client.get(f'/api/interview/sessions/{session.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(str(response.data['id']), str(session.id))

    def test_save_interview_answer(self):
        """Test saving an answer during interview."""
        session = InterviewSession.objects.create(
            user=self.user,
            questions=[{'id': 'q1', 'text': 'Test question?'}],
            status='in_progress'
        )

        data = {
            'question_id': 'q1',
            'text': 'This is my answer to the question.',
            'time_spent': 120
        }
        response = self.client.put(
            f'/api/interview/sessions/{session.id}/answer',
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['answers']), 1)

    def test_submit_interview(self):
        """Test submitting a completed interview."""
        session = InterviewSession.objects.create(
            user=self.user,
            questions=[
                {'id': 'q1', 'text': 'Question 1?'},
                {'id': 'q2', 'text': 'Question 2?'},
            ],
            answers=[
                {'question_id': 'q1', 'text': 'Answer 1 with sufficient detail to score well.', 'time_spent': 120},
                {'question_id': 'q2', 'text': 'Answer 2 also with good detail and explanation.', 'time_spent': 150},
            ],
            status='in_progress'
        )

        response = self.client.post(f'/api/interview/sessions/{session.id}/submit')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'completed')
        self.assertIsNotNone(response.data['score'])
        self.assertTrue(response.data['score'] > 0)
        self.assertTrue(len(response.data['checklist']) > 0)
        self.assertIn('ai_feedback', response.data)

    def test_cannot_modify_completed_interview(self):
        """Test that completed interviews cannot be modified."""
        session = InterviewSession.objects.create(
            user=self.user,
            questions=[{'id': 'q1', 'text': 'Test question?'}],
            status='completed'
        )

        data = {
            'question_id': 'q1',
            'text': 'Trying to modify completed interview',
            'time_spent': 60
        }
        response = self.client.put(
            f'/api/interview/sessions/{session.id}/answer',
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

