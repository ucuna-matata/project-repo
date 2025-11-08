// Files service for file uploads and management
import * as api from './api';

export interface UploadedFile {
  id: number;
  file_url: string;
  file_name: string;
  file_size: number;
  uploaded_at: string;
}

export const filesService = {
  /**
   * Upload a file (CV, documents, etc.)
   */
  async uploadFile(file: File): Promise<UploadedFile> {
    return api.uploadFile(file);
  },

  /**
   * Delete a specific file by ID
   */
  async deleteFile(fileId: number): Promise<void> {
    const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8000';

    // Get CSRF token
    const csrfToken = getCsrfToken();
    const headers: Record<string, string> = {};
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    const res = await fetch(`${API_ORIGIN}/api/files/${fileId}/`, {
      method: 'DELETE',
      credentials: 'include',
      headers,
    });

    if (!res.ok) {
      throw new Error('Failed to delete file');
    }
  },

  /**
   * Get file details by ID
   */
  async getFile(fileId: number): Promise<UploadedFile> {
    const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8000';

    const res = await fetch(`${API_ORIGIN}/api/files/${fileId}/`, {
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch file');
    }

    return res.json();
  },
};

// Helper function to get CSRF token
function getCsrfToken(): string | null {
  const name = 'csrftoken';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

