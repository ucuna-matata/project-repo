from rest_framework import serializers
from .models import TrainerResult


class TrainerResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainerResult
        fields = [
            'id', 'module_key', 'attempts', 'score', 
            'max_score', 'metadata', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class TrainerAttemptSerializer(serializers.Serializer):
    module_key = serializers.ChoiceField(
        choices=['frontend-basics', 'backend-basics', 'algorithms', 'system-design', 'behavioral']
    )


class TrainerSubmitSerializer(serializers.Serializer):
    answers = serializers.ListField(
        child=serializers.DictField()
    )
    time_taken = serializers.IntegerField(min_value=0, required=False)

