from django.urls import path
from . import views

app_name = 'trainer'

urlpatterns = [
    path('start', views.start_trainer_attempt, name='start_attempt'),
    path('submit', views.submit_trainer_attempt, name='submit_attempt'),
    path('results', views.list_trainer_results, name='list_results'),
    path('results/<uuid:result_id>', views.get_trainer_result, name='get_result'),
]

