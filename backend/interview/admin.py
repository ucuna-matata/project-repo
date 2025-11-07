from django.contrib import admin
from .models import InterviewSession


@admin.register(InterviewSession)
class InterviewSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'status', 'score', 'started_at', 'ended_at']
    list_filter = ['status', 'started_at']
    search_fields = ['user__email']
    readonly_fields = ['user', 'started_at', 'ended_at', 'duration_sec', 'score']
    ordering = ['-started_at']
