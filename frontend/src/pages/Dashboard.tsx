import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FileText, MessageSquare, Trophy, Download, Trash2, Sparkles, ArrowRight, TrendingUp, Plus, Eye, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { profileService, type CV } from '../services';

export default function Dashboard() {
  const { t } = useTranslation();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [cvsLoading, setCvsLoading] = useState(true);

  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = async () => {
    try {
      setCvsLoading(true);
      const data = await profileService.listCVs();
      setCvs(data.slice(0, 3)); // Show only first 3
    } catch (err) {
      console.error('Failed to load CVs:', err);
    } finally {
      setCvsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const features = [
    {
      icon: FileText,
      title: t('cv.title'),
      description: 'Create and manage your professional CV with AI assistance',
      to: '/cv',
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    },
    {
      icon: MessageSquare,
      title: t('interview.title'),
      description: 'Practice with mock interviews and get instant feedback',
      to: '/interview',
      gradient: 'from-green-500 to-emerald-500',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
    },
    {
      icon: Trophy,
      title: t('trainer.title'),
      description: 'Test your skills with quizzes and challenges',
      to: '/trainer',
      gradient: 'from-amber-500 to-orange-500',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="space-y-12 animate-slide-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl glass-effect p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white to-white rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2C848F] to-[#1B575F] text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Career Tools</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">{t('dashboard.title')}</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mb-8">
            {t('dashboard.welcome')} Your journey to career success starts here with AI-powered tools designed to help you shine.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/cv" className="btn-primary inline-flex items-center gap-2">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
            <button className="btn-secondary inline-flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              View Progress
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Explore Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.to}
              to={feature.to}
              className="group glass-effect p-8 rounded-2xl card-hover relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className={`${feature.iconBg} p-4 rounded-2xl inline-flex shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-600 mb-4">{feature.description}</p>
              <div className="inline-flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-4 transition-all">
                Explore
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent CVs */}
      <div className="glass-effect p-8 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">My CVs</h2>
          <Link
            to="/cv-list"
            className="inline-flex items-center gap-2 text-[#226A74] font-semibold hover:gap-3 transition-all"
          >
            View All
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {cvsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
          </div>
        ) : cvs.length === 0 ? (
          <div className="text-center py-12 bg-white/50 rounded-xl">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No CVs yet</h3>
            <p className="text-slate-600 mb-6">Create your first professional CV with AI assistance</p>
            <Link
              to="/cv-master"
              className="inline-flex items-center gap-2 btn-primary"
            >
              <Plus className="h-5 w-5" />
              Create First CV
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className="bg-white/50 hover:bg-white rounded-xl p-4 transition-all duration-300 hover:shadow-md group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {cv.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <span className="px-2 py-0.5 bg-[#226A74]/60 text-white rounded text-xs font-medium">
                        {cv.template_key}
                      </span>
                      <span>Updated {formatDate(cv.updated_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/cv-master?id=${cv.id}`}
                      className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      title="View/Edit"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/cv-master?id=${cv.id}`}
                      className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="glass-effect p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="inline-flex items-center gap-3 px-6 py-3 bg-white border-2 border-primary-200 rounded-xl text-slate-700 font-semibold hover:border-primary-400 hover:bg-primary-50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <Download className="h-5 w-5 text-primary-600" />
            Export My Data
          </button>
          <button className="inline-flex items-center gap-3 px-6 py-3 bg-white border-2 border-red-200 rounded-xl text-red-600 font-semibold hover:border-red-400 hover:bg-red-50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <Trash2 className="h-5 w-5" />
            Erase My Data
          </button>
        </div>
      </div>
    </div>
  );
}

