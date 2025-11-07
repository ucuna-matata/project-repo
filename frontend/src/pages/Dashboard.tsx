import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FileText, MessageSquare, Trophy, Download, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <p className="mt-2 text-gray-600">{t('dashboard.welcome')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/cv"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <FileText className="h-12 w-12 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('cv.title')}</h2>
          <p className="text-gray-600">
            Create and manage your professional CV with AI assistance
          </p>
        </Link>

        <Link
          to="/interview"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <MessageSquare className="h-12 w-12 text-green-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('interview.title')}</h2>
          <p className="text-gray-600">
            Practice with mock interviews and get instant feedback
          </p>
        </Link>

        <Link
          to="/trainer"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <Trophy className="h-12 w-12 text-yellow-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('trainer.title')}</h2>
          <p className="text-gray-600">
            Test your skills with quizzes and challenges
          </p>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-5 w-5 mr-2" />
            Export My Data
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50">
            <Trash2 className="h-5 w-5 mr-2" />
            Erase My Data
          </button>
        </div>
      </div>
    </div>
  );
}

