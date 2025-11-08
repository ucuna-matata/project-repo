from django.urls import path
from . import views

app_name = 'profiles'

urlpatterns = [
    path('profile/', views.profile_detail, name='profile_detail'),
    path('cvs/', views.cv_list, name='cv_list'),
    path('cvs/<uuid:cv_id>/', views.cv_detail, name='cv_detail'),
    path('cvs/<uuid:cv_id>/export/', views.cv_export, name='cv_export'),
    path('cvs/<uuid:cv_id>/enhance/', views.enhance_cv_section_with_ai, name='enhance_cv_section'),
    path('cvs/generate/', views.generate_cv_with_ai, name='generate_cv_ai'),
    path('export/', views.export_data, name='export_data'),
    path('erase/', views.erase_data, name='erase_data'),
    path('healthz/', views.health_check, name='health_check'),
]
