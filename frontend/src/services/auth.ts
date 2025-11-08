// frontend/src/services/auth.ts
import * as api from './api';

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8000';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

// Get CSRF token from cookie
function getCsrfToken(): string | null {
  const name = 'csrftoken';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export const authService = {
  async getGoogleAuthUrl(): Promise<{ auth_url: string }> {
    const res = await fetch(`${API_ORIGIN}/api/auth/google/start`, {
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error('Failed to get Google auth URL');
    }
    return res.json();
  },

  async getCurrentUser(): Promise<User> {
    return api.getMe();
  },

  async logout(): Promise<void> {
    const headers: Record<string, string> = {};
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    const res = await fetch(`${API_ORIGIN}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers,
    });
    if (!res.ok) {
      throw new Error('Logout failed');
    }
  },
};
