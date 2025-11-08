from django.urls import path
from . import views

app_name = 'trainer'

urlpatterns = [
    path('categories/', views.get_categories, name='get_categories'),
    path('questions/<str:category>/', views.get_questions, name='get_questions'),
]

