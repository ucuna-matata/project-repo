from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Profile, CV

User = get_user_model()


class ProfileTests(TestCase):
    """Test profile endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='profile@example.com',
            google_sub='google123'
        )
        self.profile = Profile.objects.create(
            user=self.user,
            summary='Test summary',
            skills=['Python', 'Django', 'React']
        )
        self.client.force_authenticate(user=self.user)

    def test_get_profile(self):
        """Test getting user profile."""
        response = self.client.get('/api/profile')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary'], 'Test summary')
        self.assertEqual(len(response.data['skills']), 3)

    def test_update_profile(self):
        """Test updating user profile."""
        data = {
            'summary': 'Updated summary',
            'skills': ['Python', 'Django', 'React', 'TypeScript']
        }
        response = self.client.put('/api/profile', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary'], 'Updated summary')
        self.assertEqual(len(response.data['skills']), 4)

        # Verify history log
        self.profile.refresh_from_db()
        self.assertTrue(len(self.profile.history_log) > 0)


class CVTests(TestCase):
    """Test CV endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='cv@example.com',
            google_sub='google456'
        )
        Profile.objects.create(user=self.user)
        self.client.force_authenticate(user=self.user)

    def test_create_cv(self):
        """Test creating a CV."""
        data = {
            'title': 'Software Engineer CV',
            'template_key': 'clean',
            'sections': {
                'personal': {'name': 'Test User', 'email': 'test@example.com'},
                'experience': []
            }
        }
        response = self.client.post('/api/cvs', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Software Engineer CV')
        self.assertEqual(response.data['version'], 1)

    def test_list_cvs(self):
        """Test listing user's CVs."""
        CV.objects.create(
            user=self.user,
            title='CV 1',
            template_key='clean',
            sections={}
        )
        CV.objects.create(
            user=self.user,
            title='CV 2',
            template_key='two-column',
            sections={}
        )

        response = self.client.get('/api/cvs')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_update_cv(self):
        """Test updating a CV."""
        cv = CV.objects.create(
            user=self.user,
            title='Original Title',
            template_key='clean',
            sections={'personal': {}}
        )

        data = {
            'title': 'Updated Title',
            'sections': {'personal': {'name': 'New Name'}}
        }
        response = self.client.put(f'/api/cvs/{cv.id}', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Title')
        self.assertEqual(response.data['version'], 2)

        # Verify changelog
        cv.refresh_from_db()
        self.assertTrue(len(cv.changelog) > 0)

    def test_delete_cv(self):
        """Test deleting a CV."""
        cv = CV.objects.create(
            user=self.user,
            title='To Delete',
            template_key='clean',
            sections={}
        )

        response = self.client.delete(f'/api/cvs/{cv.id}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(CV.objects.filter(id=cv.id).exists())


class ExportTests(TestCase):
    """Test data export functionality."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='export@example.com',
            google_sub='google789'
        )
        Profile.objects.create(user=self.user, summary='Test profile')
        CV.objects.create(
            user=self.user,
            title='Test CV',
            template_key='clean',
            sections={}
        )
        self.client.force_authenticate(user=self.user)

    def test_export_data(self):
        """Test exporting all user data."""
        response = self.client.post('/api/export')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify data structure
        self.assertIn('version', response.data)
        self.assertIn('user', response.data)
        self.assertIn('profile', response.data)
        self.assertIn('cvs', response.data)
        self.assertIn('interviews', response.data)
        self.assertIn('trainer_results', response.data)

        # Verify content
        self.assertEqual(response.data['user']['email'], 'export@example.com')
        self.assertEqual(len(response.data['cvs']), 1)


class CVExportTests(TestCase):
    """Test CV export to PDF and DOCX."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='cvexport@example.com',
            google_sub='google999'
        )
        Profile.objects.create(user=self.user, summary='Test profile')
        self.cv = CV.objects.create(
            user=self.user,
            title='Test Export CV',
            template_key='clean',
            sections={
                'personal': {
                    'name': 'Test User',
                    'email': 'test@example.com',
                    'phone': '+1 555-1234',
                    'location': 'Test City'
                },
                'summary': 'Test summary',
                'experience': [
                    {
                        'position': 'Developer',
                        'company': 'Test Corp',
                        'start_date': '2020-01',
                        'end_date': None,
                        'description': 'Test description',
                        'achievements': ['Achievement 1', 'Achievement 2']
                    }
                ],
                'education': [
                    {
                        'degree': 'BS Computer Science',
                        'institution': 'Test University',
                        'start_date': '2016-09',
                        'end_date': '2020-05'
                    }
                ],
                'skills': ['Python', 'Django', 'React'],
                'projects': [],
                'links': {
                    'github': 'https://github.com/testuser',
                    'linkedin': 'https://linkedin.com/in/testuser'
                }
            }
        )
        self.client.force_authenticate(user=self.user)
