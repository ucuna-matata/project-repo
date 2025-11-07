import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Trash2, Globe } from 'lucide-react';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = useState(i18n.language);

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    i18n.changeLanguage(newLocale);
  };

  const handleExport = () => {
    // Mock export functionality
    const data = {
      user: {
        email: 'user@example.com',
        name: 'John Doe',
      },
      cv: [],
      interviews: [],
      trainer: [],
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-data.json';
    a.click();
  };

  const handleErase = () => {
    if (confirm('Are you sure you want to erase all your data? This action cannot be undone.')) {
      alert('Data erasure requested. Your account will be deleted.');
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('settings.title') || 'Settings'}</h1>
        <p className="mt-2 text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Language Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Globe className="h-6 w-6 text-gray-700 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Language</h2>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleLocaleChange('en')}
              className={`px-4 py-2 rounded-md border ${
                locale === 'en'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLocaleChange('uk')}
              className={`px-4 py-2 rounded-md border ${
                locale === 'uk'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Українська
            </button>
          </div>
        </div>

        {/* Data Export */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Download className="h-6 w-6 text-gray-700 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Export Data</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Download all your data including CV, interview results, and trainer scores in JSON format.
          </p>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Export My Data
          </button>
        </div>

        {/* Privacy */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
              <span className="ml-3 text-gray-700">Allow analytics cookies</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
              <span className="ml-3 text-gray-700">Essential cookies (required)</span>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white p-6 rounded-lg shadow border-2 border-red-200">
          <div className="flex items-center mb-4">
            <Trash2 className="h-6 w-6 text-red-600 mr-3" />
            <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button
            onClick={handleErase}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Erase My Data
          </button>
        </div>
      </div>
    </div>
  );
}

