from rest_framework import serializers
from .models import User, AuditEvent, DeletionRequest


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'avatar_url',
            'locale', 'consent_analytics', 'created_at', 'last_login_at'
        ]
        read_only_fields = ['id', 'created_at', 'last_login_at']


class AuditEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditEvent
        fields = ['id', 'type', 'payload', 'ts']
        read_only_fields = ['id', 'ts']


class DeletionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeletionRequest
        fields = ['id', 'status', 'requested_at', 'processed_at']
        read_only_fields = ['id', 'status', 'requested_at', 'processed_at']

