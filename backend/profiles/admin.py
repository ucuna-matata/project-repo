from django.contrib import admin
from .models import Profile, CV


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'updated_at']
    search_fields = ['user__email']
    readonly_fields = ['user', 'updated_at']
    ordering = ['-updated_at']


@admin.register(CV)
class CVAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'template_key', 'version', 'created_at', 'updated_at']
    list_filter = ['template_key', 'created_at', 'updated_at']
    search_fields = ['title', 'user__email']
    readonly_fields = ['user', 'version', 'created_at', 'updated_at']
    ordering = ['-updated_at']
