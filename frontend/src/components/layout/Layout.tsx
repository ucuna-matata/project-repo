import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, FileText, MessageSquare, Trophy, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { authService } from '../../services/auth';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'uk' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
              >
                <Home className="h-5 w-5 mr-2" />
                {t('nav.dashboard')}
              </Link>
              <Link
                to="/cv"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <FileText className="h-5 w-5 mr-2" />
                {t('nav.cv')}
              </Link>
              <Link
                to="/interview"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                {t('nav.interview')}
              </Link>
              <Link
                to="/trainer"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <Trophy className="h-5 w-5 mr-2" />
                {t('nav.trainer')}
              </Link>
              <Link
                to="/settings"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <SettingsIcon className="h-5 w-5 mr-2" />
                {t('nav.settings')}
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                {i18n.language === 'en' ? '🇺🇦 UK' : '🇬🇧 EN'}
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <LogOut className="h-5 w-5 mr-2" />
                {t('auth.logout')}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        dashboard: 'Dashboard',
        cv: 'CV Master',
        interview: 'Interview Prep',
        trainer: 'Trainer',
        settings: 'Settings',
      },
      auth: {
        login: 'Sign in with Google',
        logout: 'Logout',
      },
      dashboard: {
        title: 'Dashboard',
        welcome: 'Welcome back!',
      },
      cv: {
        title: 'CV Master',
        create: 'Create CV',
        export: 'Export',
        generate: 'Generate with AI',
      },
      interview: {
        title: 'Interview Preparation',
        start: 'Start Interview',
        submit: 'Submit',
      },
      trainer: {
        title: 'Skills Trainer',
        start: 'Start Quiz',
      },
      common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        loading: 'Loading...',
      },
    },
  },
  uk: {
    translation: {
      nav: {
        dashboard: 'Панель',
        cv: 'Майстер CV',
        interview: 'Підготовка до співбесіди',
        trainer: 'Тренер',
        settings: 'Налаштування',
      },
      auth: {
        login: 'Увійти через Google',
        logout: 'Вийти',
      },
      dashboard: {
        title: 'Панель',
        welcome: 'З поверненням!',
      },
      cv: {
        title: 'Майстер CV',
        create: 'Створити CV',
        export: 'Експорт',
        generate: 'Згенерувати з AI',
      },
      interview: {
        title: 'Підготовка до співбесіди',
        start: 'Почати співбесіду',
        submit: 'Надіслати',
      },
      trainer: {
        title: 'Тренер навичок',
        start: 'Почати тест',
      },
      common: {
        save: 'Зберегти',
        cancel: 'Скасувати',
        delete: 'Видалити',
        edit: 'Редагувати',
        loading: 'Завантаження...',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

