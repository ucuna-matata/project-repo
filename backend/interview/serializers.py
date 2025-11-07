from rest_framework import serializers
from .models import InterviewSession


class InterviewSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewSession
        fields = [
            'id', 'questions', 'answers', 'status', 'started_at', 
            'ended_at', 'duration_sec', 'score', 'checklist', 'ai_feedback'
        ]
        read_only_fields = ['id', 'started_at', 'ended_at', 'duration_sec', 'score', 'checklist', 'ai_feedback']


class InterviewSessionCreateSerializer(serializers.Serializer):
    topic = serializers.ChoiceField(
        choices=['frontend-basics', 'backend-basics', 'algorithms', 'system-design', 'behavioral'],
        default='frontend-basics'
    )


class InterviewAnswerSerializer(serializers.Serializer):
    question_id = serializers.CharField()
    text = serializers.CharField(allow_blank=True)
    time_spent = serializers.IntegerField(min_value=0)

