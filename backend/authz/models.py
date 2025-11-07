from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import uuid


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model with Google OAuth support."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True)
    full_name = models.CharField(max_length=255, blank=True)
    avatar_url = models.URLField(blank=True, null=True)
    google_sub = models.CharField(max_length=255, unique=True, null=True, db_index=True)
    locale = models.CharField(max_length=10, default='en')
    consent_analytics = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    last_login_at = models.DateTimeField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email


class AuditEvent(models.Model):
    """Audit log for important user actions."""
    EVENT_TYPES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('export', 'Data Export'),
        ('erase', 'Data Deletion'),
        ('cv_create', 'CV Created'),
        ('cv_update', 'CV Updated'),
        ('cv_export', 'CV Exported'),
        ('interview_complete', 'Interview Completed'),
        ('trainer_complete', 'Trainer Completed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='audit_events')
    type = models.CharField(max_length=50, choices=EVENT_TYPES, db_index=True)
    payload = models.JSONField(default=dict, blank=True)
    ts = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'audit_events'
        ordering = ['-ts']
        indexes = [
            models.Index(fields=['user', '-ts']),
        ]

    def __str__(self):
        return f"{self.type} by {self.user.email} at {self.ts}"


class DeletionRequest(models.Model):
    """Track user data deletion requests."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='deletion_request')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    requested_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)

    class Meta:
        db_table = 'deletion_requests'
        ordering = ['-requested_at']

    def __str__(self):
        return f"Deletion request for {self.user.email} - {self.status}"

