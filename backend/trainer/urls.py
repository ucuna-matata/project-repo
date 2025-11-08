from django.urls import path
from . import views

app_name = 'trainer'

urlpatterns = [
    path('categories/', views.get_categories, name='get_categories'),
    path('questions/<str:category>/', views.get_questions, name='get_questions'),
    path('submit/', views.submit_result, name='submit_result'),
    path('results/', views.list_results, name='list_results'),
    path('results/<uuid:result_id>/', views.get_result, name='get_result'),
]

