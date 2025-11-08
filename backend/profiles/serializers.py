from rest_framework import serializers
from .models import Profile, CV


class ProfileSerializer(serializers.ModelSerializer):
    # Include user info from the User model
    email = serializers.EmailField(source='user.email', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    avatar_url = serializers.URLField(source='user.avatar_url', read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'email', 'full_name', 'avatar_url',
            'links', 'education', 'experience', 'skills',
            'projects', 'summary', 'preferences', 'updated_at'
        ]
        read_only_fields = ['id', 'email', 'full_name', 'avatar_url', 'updated_at']


class CVSerializer(serializers.ModelSerializer):
    class Meta:
        model = CV
        fields = [
            'id', 'title', 'template_key', 'sections', 'rendered_pdf_url',
            'version', 'changelog', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'rendered_pdf_url', 'created_at', 'updated_at']


class CVCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CV
        fields = ['title', 'template_key', 'sections']


class CVUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CV
        fields = ['title', 'template_key', 'sections']

