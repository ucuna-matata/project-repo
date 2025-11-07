from django.urls import path
from . import views

app_name = 'authz'

urlpatterns = [
    path('google/start', views.google_oauth_start, name='google_oauth_start'),
    path('google/callback', views.google_oauth_callback, name='google_oauth_callback'),
    path('me', views.current_user, name='current_user'),
    path('logout', views.logout_view, name='logout'),
]

