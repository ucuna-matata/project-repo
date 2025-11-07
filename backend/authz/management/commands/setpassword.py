"""
Django management command to set superuser password
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = 'Set password for a user'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='User email')
        parser.add_argument('password', type=str, help='New password')

    def handle(self, *args, **options):
        User = get_user_model()
        email = options['email']
        password = options['password']
        
        try:
            user = User.objects.get(email=email)
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Password set for {email}'))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User {email} does not exist'))

