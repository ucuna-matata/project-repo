#!/usr/bin/env python
"""Test script to verify trainer results API endpoint"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from trainer.models import TrainerResult
from trainer.views import list_results
from rest_framework.test import APIRequestFactory, force_authenticate

User = get_user_model()

# Get the first user
user = User.objects.first()
if not user:
    print("❌ No users found in database")
    exit(1)

print(f"✅ Testing with user: {user.email}")
print(f"📊 Total results in DB for this user: {TrainerResult.objects.filter(user=user).count()}")

# Test the list_results endpoint
factory = APIRequestFactory()
request = factory.get('/api/trainer/results/')
force_authenticate(request, user=user)

response = list_results(request)

print(f"\n📊 Response status: {response.status_code}")
print(f"📊 Response data ({len(response.data)} results):")
for result in response.data:
    print(f"   - {result['module_key']}: {result['score']}/{result['max_score']} (Attempt #{result['attempts']})")

print("\n✅ API test completed!")

