import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Trash2, Globe, Shield, Bell, User, Save } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import * as api from '../services/api';
import { useProfile, useUpdateProfile } from '../hooks/useApi';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = useState(i18n.language);

  // Profile data
  const { data: profile, isLoading: profileLoading } = useProfile();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [summary, setSummary] = useState('');

  // Update local state when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setEmail(profile.email || '');
      setSummary(profile.summary || '');
    }
  }, [profile]);

  const updateProfileMutation = useUpdateProfile();

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync({
        full_name: fullName,
        email: email,
        summary: summary,
      });
      alert(t('settings.profileUpdated'));
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(t('settings.profileUpdateFailed'));
    }
  };

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    i18n.changeLanguage(newLocale);
    // TODO: Also update user profile in backend with new locale
  };

  const exportMutation = useMutation({
    mutationFn: api.exportProfile,
    onSuccess: (data: unknown) => {
      // Create a Blob from the JSON data
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `my-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert(t('settings.dataExported'));
    },
    onError: () => {
      alert(t('settings.exportFailed'));
    },
  });

  const eraseMutation = useMutation({
    mutationFn: api.eraseData,
    onSuccess: () => {
      alert(t('settings.dataErased'));
      window.location.href = '/login';
    },
    onError: () => {
      alert(t('settings.eraseFailed'));
    },
  });

  const handleExport = () => {
    exportMutation.mutate();
  };

  const handleErase = () => {
    const confirmed = window.confirm(t('settings.eraseConfirm'));

    if (confirmed) {
      const confirmation = window.prompt(t('settings.erasePrompt'));
      if (confirmation === 'DELETE') {
        eraseMutation.mutate();
      } else {
        alert(t('settings.eraseCancelled'));
      }
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl glass-effect p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-full blur-3xl -z-10"></div>
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-primary-600 to-accent-600 p-3 rounded-2xl shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              {t('settings.title')}
            </h1>
            <p className="text-lg text-slate-600">{t('settings.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="glass-effect p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-primary-600 to-accent-600 p-3 rounded-xl shadow-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{t('settings.profile.title')}</h2>
        </div>

        {profileLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                {t('settings.profile.fullName')}
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 transition-all"
                placeholder={t('settings.profile.fullNamePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                {t('settings.profile.email')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 transition-all"
                placeholder={t('settings.profile.emailPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-slate-700 mb-2">
                {t('settings.profile.summary')}
              </label>
              <textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                placeholder={t('settings.profile.summaryPlaceholder')}
              />
            </div>

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              {updateProfileMutation.isPending ? t('settings.profile.saving') : t('settings.profile.saveChanges')}
            </button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Settings */}
        <div className="glass-effect p-6 rounded-2xl card-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{t('settings.language.title')}</h2>
          </div>
          <p className="text-slate-600 mb-4">{t('settings.language.description')}</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleLocaleChange('en')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                locale === 'en'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                  : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-primary-300 hover:shadow-md'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLocaleChange('uk')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                locale === 'uk'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                  : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-primary-300 hover:shadow-md'
              }`}
            >
              Українська
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-effect p-6 rounded-2xl card-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{t('settings.notifications.title')}</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors cursor-pointer">
              <span className="text-slate-700 font-medium">{t('settings.notifications.email')}</span>
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-500" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors cursor-pointer">
              <span className="text-slate-700 font-medium">{t('settings.notifications.reminders')}</span>
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-500" defaultChecked />
            </label>
          </div>
        </div>

        {/* Data Export */}
        <div className="glass-effect p-6 rounded-2xl card-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl shadow-lg">
              <Download className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{t('settings.export.title')}</h2>
          </div>
          <p className="text-slate-600 mb-6">
            {t('settings.export.description')}
          </p>
          <button
            onClick={handleExport}
            disabled={exportMutation.isPending}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportMutation.isPending ? t('settings.export.exporting') : t('settings.export.button')}
          </button>
        </div>

        {/* Privacy */}
        <div className="glass-effect p-6 rounded-2xl card-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-xl shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{t('settings.privacy.title')}</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors cursor-pointer">
              <span className="text-slate-700 font-medium">{t('settings.privacy.analytics')}</span>
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-500" />
            </label>
            <label className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors cursor-not-allowed">
              <span className="text-slate-700 font-medium">{t('settings.privacy.essential')}</span>
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary-600" defaultChecked disabled />
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-effect p-8 rounded-2xl border-2 border-red-200/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
            <Trash2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-red-600">{t('settings.danger.title')}</h2>
            <p className="text-slate-600">{t('settings.danger.warning')}</p>
          </div>
        </div>
        <p className="text-slate-700 mb-6 text-lg">
          {t('settings.danger.description')}
        </p>
        <button
          onClick={handleErase}
          disabled={eraseMutation.isPending}
          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-5 w-5" />
          {eraseMutation.isPending ? t('settings.danger.erasing') : t('settings.danger.button')}
        </button>
      </div>
    </div>
  );
}