// frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './i18n/config';
import Dashboard from './pages/Dashboard';
import CVMaster from './pages/CVMaster';
import Interview from './pages/Interview';
import Trainer from './pages/Trainer';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Layout from './components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { authService } from './services/auth';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

function PrivateRoute() {
  const { isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getCurrentUser,
  });
  if (isLoading) return <div className="p-8">Loading…</div>;
  if (isError) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="cv" element={<CVMaster />} />
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
