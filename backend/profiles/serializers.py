from rest_framework import serializers
from .models import Profile, CV


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'id', 'links', 'education', 'experience', 'skills', 
            'projects', 'summary', 'preferences', 'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']


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

