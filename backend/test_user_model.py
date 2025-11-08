"""
Quick test to verify the AttributeError fix
"""
import os
import sys
from pathlib import Path

backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Test that User model doesn't have get_full_name method
print("=" * 60)
print("Testing User model attributes")
print("=" * 60)

user = User(email='test@example.com', full_name='Test User')

print(f"✓ User has 'full_name' attribute: {hasattr(user, 'full_name')}")
print(f"✓ User has 'email' attribute: {hasattr(user, 'email')}")
print(f"✗ User has 'get_full_name' method: {hasattr(user, 'get_full_name')}")

if hasattr(user, 'get_full_name'):
    print("\n❌ ERROR: User should NOT have get_full_name() method!")
else:
    print("\n✅ SUCCESS: User model is correct!")

# Test the fallback logic
print(f"\nTesting fallback logic:")
print(f"  full_name = '{user.full_name}'")
print(f"  email = '{user.email}'")
print(f"  Result: '{user.full_name or user.email}'")

user_without_name = User(email='test2@example.com', full_name='')
print(f"\nUser without full_name:")
print(f"  full_name = '{user_without_name.full_name}'")
print(f"  email = '{user_without_name.email}'")
print(f"  Result: '{user_without_name.full_name or user_without_name.email}'")

print("\n" + "=" * 60)
print("Test completed!")
print("=" * 60)

