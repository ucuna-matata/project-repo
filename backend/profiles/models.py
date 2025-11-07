from django.db import models
from django.conf import settings
import uuid


class Profile(models.Model):
    """User profile with career information."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')

    # Contact & Links
    links = models.JSONField(default=dict, blank=True)  # {linkedin, github, portfolio, etc}

    # Career Data (arrays stored as JSON)
    education = models.JSONField(default=list, blank=True)  # [{degree, institution, year, description}]
    experience = models.JSONField(default=list, blank=True)  # [{title, company, start, end, description}]
    skills = models.JSONField(default=list, blank=True)  # [{name, category, level}]
    projects = models.JSONField(default=list, blank=True)  # [{title, description, tech, link}]

    # Text fields
    summary = models.TextField(blank=True)

    # Preferences
    preferences = models.JSONField(default=dict, blank=True)  # {job_type, location, remote, etc}

    # History tracking
    history_log = models.JSONField(default=list, blank=True)  # [{field, old_value, new_value, ts}]

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'profiles'

    def __str__(self):
        return f"Profile of {self.user.email}"


class CV(models.Model):
    """CV document with versioning and changelog."""
    TEMPLATE_CHOICES = [
        ('clean', 'Clean Template'),
        ('two-column', 'Two Column Template'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cvs')
    title = models.CharField(max_length=255)
    template_key = models.CharField(max_length=50, choices=TEMPLATE_CHOICES, default='clean')

    # CV content stored as JSON for flexibility
    sections = models.JSONField(default=dict, blank=True)  # {personal, experience, education, skills, etc}

    # Export/render
    rendered_pdf_url = models.URLField(blank=True, null=True)

    # Versioning
    version = models.IntegerField(default=1)
    changelog = models.JSONField(default=list, blank=True)  # [{version, author, ts, changes}]

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        db_table = 'cvs'
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['user', '-updated_at']),
        ]

    def __str__(self):
        return f"{self.title} by {self.user.email}"
