"""
Security middleware for rate limiting and additional protections.
"""
from django.core.cache import cache
from django.http import JsonResponse
from django.conf import settings


class RateLimitMiddleware:
    """
    Simple rate limiting middleware for additional security.
    Note: DRF has built-in throttling, but this adds an extra layer.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip rate limiting for authenticated users on most endpoints
        if request.user.is_authenticated and not request.path.startswith('/api/auth/'):
            return self.get_response(request)

        # Get client IP
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')

        # Create cache key
        cache_key = f'rate_limit:{ip}:{request.path}'
        
        # Get current request count
        request_count = cache.get(cache_key, 0)
        
        # Allow 100 requests per minute for anonymous users
        if request_count >= 100:
            return JsonResponse(
                {'error': 'Rate limit exceeded. Please try again later.'},
                status=429
            )
        
        # Increment counter
        if request_count == 0:
            cache.set(cache_key, 1, 60)  # 60 seconds
        else:
            cache.incr(cache_key)

        response = self.get_response(request)
        return response


class SecurityHeadersMiddleware:
    """
    Add security headers to all responses.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Add security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Content Security Policy
        if not settings.DEBUG:
            response['Content-Security-Policy'] = (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline'; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data: https:; "
                "font-src 'self' data:; "
                "connect-src 'self';"
            )
            response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'

        return response

