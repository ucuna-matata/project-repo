import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Trash2, Globe, Shield, Bell, User } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import * as api from '../services/api';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = useState(i18n.language);

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

      alert('✓ Data exported successfully!');
    },
    onError: () => {
      alert('✗ Failed to export data. Please try again.');
    },
  });

  const eraseMutation = useMutation({
    mutationFn: api.eraseData,
    onSuccess: () => {
      alert('Data erasure request submitted. You will be logged out.');
      window.location.href = '/login';
    },
    onError: () => {
      alert('Failed to erase data. Please try again.');
    },
  });

  const handleExport = () => {
    exportMutation.mutate();
  };

  const handleErase = () => {
    const confirmed = window.confirm(
      '⚠️ Are you absolutely sure you want to erase all your data?\n\n' +
      'This will permanently delete:\n' +
      '• Your profile and CV data\n' +
      '• All interview sessions\n' +
      '• All training results\n' +
      '• Your account\n\n' +
      'This action CANNOT be undone!\n\n' +
      'Type "DELETE" in the next prompt to confirm.'
    );

    if (confirmed) {
      const confirmation = window.prompt('Type "DELETE" to confirm permanent deletion:');
      if (confirmation === 'DELETE') {
        eraseMutation.mutate();
      } else {
        alert('Deletion cancelled. Text did not match.');
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
              {t('settings.title') || 'Settings'}
            </h1>
            <p className="text-lg text-slate-600">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Settings */}
        <div className="glass-effect p-6 rounded-2xl card-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Language</h2>
          </div>
          <p className="text-slate-600 mb-4">Choose your preferred language</p>
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
            <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors cursor-pointer">
              <span className="text-slate-700 font-medium">Email notifications</span>
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-500" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors cursor-pointer">
              <span className="text-slate-700 font-medium">Interview reminders</span>
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
            <h2 className="text-2xl font-bold text-slate-900">Export Data</h2>
          </div>
          <p className="text-slate-600 mb-6">
            Download all your data including CV, interview results, and trainer scores in JSON format.
          </p>
          <button
            onClick={handleExport}
            disabled={exportMutation.isPending}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportMutation.isPending ? 'Exporting...' : 'Export My Data'}
          </button>
        </div>

        {/* Privacy */}
        <div className="glass-effect p-6 rounded-2xl card-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-xl shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Privacy</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors cursor-pointer">
              <span className="text-slate-700 font-medium">Allow analytics cookies</span>
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-500" />
            </label>
            <label className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors cursor-not-allowed">
              <span className="text-slate-700 font-medium">Essential cookies (required)</span>
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
            <h2 className="text-2xl font-bold text-red-600">Danger Zone</h2>
            <p className="text-slate-600">Proceed with caution</p>
          </div>
        </div>
        <p className="text-slate-700 mb-6 text-lg">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={handleErase}
          disabled={eraseMutation.isPending}
          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-5 w-5" />
          {eraseMutation.isPending ? 'Erasing...' : 'Erase My Data'}
        </button>
      </div>
    </div>
  );
}

