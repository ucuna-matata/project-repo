// frontend/src/components/layout/Layout.tsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, FileText, MessageSquare, Trophy, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { authService } from '../../services/auth';

export default function Layout() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-xl font-bold text-blue-700">Hirely</Link>
            <Link to="/dashboard" className="inline-flex items-center text-sm text-gray-700 hover:text-blue-600">
              <Home className="h-5 w-5 mr-2" /> {t('nav.home') ?? 'Home'}
            </Link>
            <Link to="/cv" className="inline-flex items-center text-sm text-gray-700 hover:text-blue-600">
              <FileText className="h-5 w-5 mr-2" /> {t('nav.cv') ?? 'CV Master'}
            </Link>
            <Link to="/interview" className="inline-flex items-center text-sm text-gray-700 hover:text-blue-600">
              <MessageSquare className="h-5 w-5 mr-2" /> {t('nav.interview') ?? 'Interview'}
            </Link>
            <Link to="/trainer" className="inline-flex items-center text-sm text-gray-700 hover:text-blue-600">
              <Trophy className="h-5 w-5 mr-2" /> {t('nav.trainer') ?? 'Trainer'}
            </Link>
            <Link to="/settings" className="inline-flex items-center text-sm text-gray-700 hover:text-blue-600">
              <SettingsIcon className="h-5 w-5 mr-2" /> {t('nav.settings') ?? 'Settings'}
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center text-sm text-gray-700 hover:text-red-600"
          >
            <LogOut className="h-5 w-5 mr-2" /> {t('auth.logout') ?? 'Logout'}
          </button>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
