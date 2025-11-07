from django.db import models
from django.conf import settings
import uuid


class InterviewSession(models.Model):
    """Track interview practice sessions."""
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('abandoned', 'Abandoned'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='interview_sessions')

    # Questions and answers
    questions = models.JSONField(default=list)  # [{id, text, category, expected_points}]
    answers = models.JSONField(default=list, blank=True)  # [{question_id, text, time_spent}]

    # Status and timing
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    started_at = models.DateTimeField(auto_now_add=True, db_index=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    duration_sec = models.IntegerField(null=True, blank=True)

    # Results
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    checklist = models.JSONField(default=list, blank=True)  # [{criterion, passed, notes}]
    ai_feedback = models.JSONField(default=dict, blank=True)  # {strengths, weaknesses, tips}

    class Meta:
        db_table = 'interview_sessions'
        ordering = ['-started_at']
        indexes = [
            models.Index(fields=['user', '-started_at']),
            models.Index(fields=['status', '-started_at']),
        ]

    def __str__(self):
        return f"Interview {self.id} by {self.user.email} - {self.status}"

