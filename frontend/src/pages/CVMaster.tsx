import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import CVExportButtons from '../components/cv/CVExportButtons';

export default function CVMaster() {
  const { t } = useTranslation();
  const [currentCVId] = useState<string | null>(null);

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('cv.title')}</h1>
        <p className="mt-2 text-gray-600">Create and manage your professional CV</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">CV Form</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
              <textarea
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Brief summary of your experience and skills"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {t('common.save')}
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {t('cv.generate')}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
            {currentCVId && (
              <CVExportButtons cvId={currentCVId} cvTitle="My CV" />
            )}
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
            <p>CV Preview</p>
            <p className="text-sm mt-2">Fill in the form to see your CV preview</p>
            {!currentCVId && (
              <p className="text-xs mt-4 text-gray-400">Save your CV to enable export options</p>
            )}
          </div>

          {currentCVId && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900 mb-2 font-medium">Export your CV:</p>
              <p className="text-xs text-blue-700 mb-3">
                Download your CV in PDF format for easy sharing, or DOCX format for further editing.
              </p>
              <div className="flex gap-2">
                <CVExportButtons cvId={currentCVId} cvTitle="My CV" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

