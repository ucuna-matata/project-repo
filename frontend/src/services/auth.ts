import apiClient from './api';

export interface User {
  id: number;
  email: string;
  full_name: string;
  avatar_url?: string;
}

export const authService = {
  async getGoogleAuthUrl(): Promise<{ auth_url: string }> {
    const response = await apiClient.get('/auth/google/start/');
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me/');
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout/');
  },
};

