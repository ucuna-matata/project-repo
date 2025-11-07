from django.db import models
from django.conf import settings
import uuid


class TrainerResult(models.Model):
    """Store results from trainer modules (quizzes, challenges)."""
    MODULE_CHOICES = [
        ('frontend-basics', 'Frontend Basics'),
        ('backend-basics', 'Backend Basics'),
        ('algorithms', 'Algorithms'),
        ('system-design', 'System Design'),
        ('behavioral', 'Behavioral Questions'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trainer_results')
    module_key = models.CharField(max_length=50, choices=MODULE_CHOICES, db_index=True)

    # Results
    attempts = models.IntegerField(default=1)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    max_score = models.DecimalField(max_digits=5, decimal_places=2, default=100)

    # Additional data (questions answered, time taken, etc)
    metadata = models.JSONField(default=dict, blank=True)  # {questions, answers, time_taken, etc}

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'trainer_results'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'module_key', '-created_at']),
        ]

    def __str__(self):
        return f"{self.module_key} by {self.user.email} - {self.score}/{self.max_score}"

