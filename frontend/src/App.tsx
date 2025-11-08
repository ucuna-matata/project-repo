// frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import './i18n/config';
import Dashboard from './pages/Dashboard';
import CVMaster from './pages/CVMaster';
import CVList from './pages/CVList';
import Interview from './pages/Interview';
import Trainer from './pages/Trainer';
import Settings from './pages/Settings';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Layout from './components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { authService } from './services/auth';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

function PrivateRoute() {
  const { t } = useTranslation();
  const { isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getCurrentUser,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-slate-600 font-medium">{t('common.loadingWorkspace')}</p>
        </div>
      </div>
    );
  }

  if (isError) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="cv" element={<CVList />} />
              <Route path="cv-list" element={<CVList />} />
              <Route path="cv-master" element={<CVMaster />} />
              <Route path="interview" element={<Interview />} />
              <Route path="trainer" element={<Trainer />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}