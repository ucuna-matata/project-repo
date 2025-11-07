from django.urls import path
from . import views

app_name = 'profiles'

urlpatterns = [
    path('profile', views.profile_detail, name='profile_detail'),
    path('cvs', views.cv_list, name='cv_list'),
    path('cvs/<uuid:cv_id>', views.cv_detail, name='cv_detail'),
    path('export', views.export_data, name='export_data'),
    path('erase', views.erase_data, name='erase_data'),
]

