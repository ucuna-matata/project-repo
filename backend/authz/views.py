from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.contrib.auth import login, logout
from django.shortcuts import redirect
from django.utils import timezone
import requests
import secrets

from .models import User, AuditEvent
from .serializers import UserSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def google_oauth_start(request):
    """Initiate Google OAuth flow"""
    state = secrets.token_urlsafe(32)
    request.session['oauth_state'] = state

    redirect_uri = f"{request.scheme}://{request.get_host()}/api/auth/google/callback"
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={settings.GOOGLE_CLIENT_ID}&"
        f"redirect_uri={redirect_uri}&"
        f"response_type=code&"
        f"scope=openid email profile&"
        f"state={state}"
    )
    return Response({'auth_url': google_auth_url})


@api_view(['GET'])
@permission_classes([AllowAny])
def google_oauth_callback(request):
    """Handle Google OAuth callback"""
    code = request.GET.get('code')
    state = request.GET.get('state')
    stored_state = request.session.get('oauth_state')

    # Validate state
    if not state or state != stored_state:
        return redirect(f"{settings.WEB_ORIGIN}/login?error=invalid_state")

    # Exchange code for tokens
    redirect_uri = f"{request.scheme}://{request.get_host()}/api/auth/google/callback"
    token_url = "https://oauth2.googleapis.com/token"

    token_data = {
        'code': code,
        'client_id': settings.GOOGLE_CLIENT_ID,
        'client_secret': settings.GOOGLE_CLIENT_SECRET,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    }

    try:
        token_response = requests.post(token_url, data=token_data)
        token_response.raise_for_status()
        tokens = token_response.json()

        # Get user info
        userinfo_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {'Authorization': f"Bearer {tokens['access_token']}"}
        userinfo_response = requests.get(userinfo_url, headers=headers)
        userinfo_response.raise_for_status()
        userinfo = userinfo_response.json()

        # Create or update user
        user, created = User.objects.get_or_create(
            google_sub=userinfo['id'],
            defaults={
                'email': userinfo['email'],
                'full_name': userinfo.get('name', ''),
                'avatar_url': userinfo.get('picture', ''),
            }
        )

        if not created:
            # Update existing user info
            user.email = userinfo['email']
            user.full_name = userinfo.get('name', user.full_name)
            user.avatar_url = userinfo.get('picture', user.avatar_url)

        user.last_login_at = timezone.now()
        user.save()

        # Create profile if needed
        if not hasattr(user, 'profile'):
            from profiles.models import Profile
            Profile.objects.create(user=user)

        # Log in user
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')

        # Create audit event
        AuditEvent.objects.create(
            user=user,
            type='login',
            payload={'method': 'google_oauth'}
        )

        return redirect(f"{settings.WEB_ORIGIN}/")

    except Exception as e:
        print(f"OAuth error: {str(e)}")
        return redirect(f"{settings.WEB_ORIGIN}/login?error=oauth_failed")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Get current user information"""
    serializer = UserSerializer(request.user)

    # Include profile data if exists
    data = serializer.data
    if hasattr(request.user, 'profile'):
        from profiles.serializers import ProfileSerializer
        data['profile'] = ProfileSerializer(request.user.profile).data

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout current user"""
    AuditEvent.objects.create(
        user=request.user,
        type='logout',
        payload={}
    )
    logout(request)
    return Response({'message': 'Logged out successfully'})


