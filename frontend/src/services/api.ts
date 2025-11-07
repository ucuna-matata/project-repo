// frontend/src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // використовуємо cookie-сесію від Django
});

// Можеш додати токени/хедери тут за потреби
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Глобальна обробка 401 -> /login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { apiClient };
