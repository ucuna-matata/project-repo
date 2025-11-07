from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_file, name='upload_file'),
    path('<int:pk>/', views.file_detail, name='file_detail'),
]

