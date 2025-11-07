from django.contrib import admin
from .models import TrainerResult


@admin.register(TrainerResult)
class TrainerResultAdmin(admin.ModelAdmin):
    list_display = ['user', 'module_key', 'score', 'max_score', 'attempts', 'created_at']
    list_filter = ['module_key', 'created_at']
    search_fields = ['user__email']
    readonly_fields = ['user', 'created_at']
    ordering = ['-created_at']
