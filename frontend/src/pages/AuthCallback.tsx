import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth';

export default function AuthCallback() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Backend has already set the HttpOnly session cookie via OAuth flow
        // Now we fetch /me to verify the session and cache user data
        const user = await authService.getCurrentUser();
        queryClient.setQueryData(['me'], user);
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Auth callback failed:', error);
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, queryClient]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
