import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FileText, MessageSquare, Trophy, Download, Trash2, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();

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
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
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

