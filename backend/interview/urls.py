from django.urls import path
from . import views

app_name = 'interview'

urlpatterns = [
    path('sessions/', views.create_interview_session, name='create_session'),
    path('sessions/list/', views.list_interview_sessions, name='list_sessions'),
    path('sessions/<uuid:session_id>/', views.get_interview_session, name='get_session'),
    path('sessions/<uuid:session_id>/answer/', views.save_interview_answer, name='save_answer'),
    path('sessions/<uuid:session_id>/submit/', views.submit_interview, name='submit_interview'),
    path('sessions/<uuid:session_id>/hint/', views.get_ai_hint, name='get_ai_hint'),
    path('sessions/<uuid:session_id>/retake/', views.retake_interview, name='retake_interview'),
]

