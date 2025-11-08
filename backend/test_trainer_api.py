#!/usr/bin/env python
"""Test script for trainer API endpoints"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from trainer.models import TrainerResult
from trainer.views import submit_result
from rest_framework.test import APIRequestFactory, force_authenticate

User = get_user_model()

# Create or get a test user
user, created = User.objects.get_or_create(
    email='test@example.com',
    defaults={'full_name': 'Test User'}
)
if created:
    user.set_password('testpass123')
    user.save()
    print(f"✅ Created test user: {user.email}")
else:
    print(f"✅ Using existing user: {user.email}")

# Test the submit endpoint
factory = APIRequestFactory()
request = factory.post('/api/trainer/submit/', {
    'module_key': 'frontend-basics',
    'score': 8,
    'max_score': 10,
    'metadata': {
        'questions': [],
        'answers': [],
        'time_taken': 120
    }
}, format='json')

force_authenticate(request, user=user)
response = submit_result(request)

print(f"\n📊 Response status: {response.status_code}")
print(f"📊 Response data: {response.data}")

# Check database
results = TrainerResult.objects.filter(user=user)
print(f"\n📁 Total results for {user.email}: {results.count()}")
for result in results:
    print(f"   - {result.module_key}: {result.score}/{result.max_score} (Attempt #{result.attempts})")

print("\n✅ Test completed!")

