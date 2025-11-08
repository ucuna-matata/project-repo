"""
Cleanup script to remove duplicate CVs for users

This script removes all CVs except the most recent one for each user.
Run this to clean up existing duplicates in the database.
"""

import os
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.contrib.auth import get_user_model
from profiles.models import CV
from django.db import transaction

User = get_user_model()

def cleanup_duplicate_cvs(dry_run=True):
    """
    Remove all CVs except the most recent one for each user.

    Args:
        dry_run: If True, only print what would be deleted without actually deleting
    """
    print("=" * 70)
    print("CV Cleanup Script - Remove Duplicate CVs")
    print("=" * 70)

    if dry_run:
        print("\n⚠️  DRY RUN MODE - No changes will be made")
        print("   Run with --execute to actually delete CVs\n")
    else:
        print("\n🔴 EXECUTE MODE - CVs will be permanently deleted!")
        print("   Press Ctrl+C within 5 seconds to cancel...\n")
        import time
        for i in range(5, 0, -1):
            print(f"   Starting in {i}...")
            time.sleep(1)
        print()

    total_users = 0
    total_cvs_deleted = 0
    users_with_duplicates = 0

    # Get all users
    users = User.objects.all()

    print(f"Found {users.count()} total users\n")

    for user in users:
        # Get all CVs for this user, ordered by creation date (newest first)
        cvs = CV.objects.filter(user=user).order_by('-created_at')
        cv_count = cvs.count()

        total_users += 1

        if cv_count > 1:
            users_with_duplicates += 1
            cvs_to_keep = cvs[0]
            cvs_to_delete = list(cvs[1:])

            print(f"👤 User: {user.email}")
            print(f"   Total CVs: {cv_count}")
            print(f"   ✓ Keeping: {cvs_to_keep.title} (ID: {cvs_to_keep.id}, created: {cvs_to_keep.created_at})")
            print(f"   🗑️  Deleting {len(cvs_to_delete)} old CV(s):")

            for cv in cvs_to_delete:
                print(f"      - {cv.title} (ID: {cv.id}, created: {cv.created_at})")

                if not dry_run:
                    cv.delete()
                    total_cvs_deleted += 1

            print()
        elif cv_count == 1:
            # User has only one CV - no action needed
            pass
        else:
            # User has no CVs
            pass

    print("=" * 70)
    print("Summary:")
    print("=" * 70)
    print(f"Total users processed: {total_users}")
    print(f"Users with duplicate CVs: {users_with_duplicates}")

    if dry_run:
        print(f"CVs that would be deleted: {sum(CV.objects.filter(user=u).count() - 1 for u in users if CV.objects.filter(user=u).count() > 1)}")
        print("\n⚠️  This was a DRY RUN - no changes were made")
        print("   Run with --execute flag to actually delete CVs")
    else:
        print(f"CVs deleted: {total_cvs_deleted}")
        print("\n✅ Cleanup completed successfully!")

    print("=" * 70)

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Cleanup duplicate CVs for users')
    parser.add_argument('--execute', action='store_true',
                       help='Actually delete CVs (default is dry-run mode)')

    args = parser.parse_args()

    cleanup_duplicate_cvs(dry_run=not args.execute)

