// frontend/src/pages/Login.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { Chrome, Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    // якщо вже залогінена сесія — одразу на /dashboard
    authService
      .getCurrentUser()
      .then(() => navigate('/dashboard'))
      .catch(() => void 0);
  }, [navigate]);

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setMsg(null);
      const { auth_url } = await authService.getGoogleAuthUrl();
      window.location.href = auth_url; // починаємо OAuth
    } catch (e) {
      console.error(e);
      setMsg('Failed to start Google OAuth. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Заглушка для email/password, бо бекенд не має відповідних ендпойнтів
  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('Email/password login is disabled. Please use “Continue with Google”.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8E8E8]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#226A74]/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#226A74]/50 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#226A74]/50 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-scale-in">
        {/* Logo/Brand */}
        <div className="flex justify-center mb-8">
          <img
            src="/logo.png"
            alt="Hirely Logo"
            className="w-50 h-50 object-contain"
          />
        </div>

        {/* Main Card */}
        <div className="glass-effect rounded-3xl p-8 shadow-2xl border border-white/10">
          <h1 className="text-3xl font-bold text-black text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600 text-center mb-8">
            Sign in to continue your career journey
          </p>

          {/* Google Sign In */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 rounded-xl px-6 py-4 bg-white text-slate-800 font-semibold hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            <Chrome className="h-5 w-5" />
            {loading ? 'Redirecting…' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-slate-400 text-sm font-medium">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Email/Password Form */}
          <form className="space-y-4" onSubmit={handleContinue}>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                placeholder="Enter email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-white/10 text-white placeholder-slate-400 pl-12 pr-4 py-4 outline-none border border-white/20 focus:border-primary-400 focus:bg-white/15 transition-all duration-200"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                placeholder="Enter password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="w-full rounded-xl bg-white/10 text-white placeholder-slate-400 pl-12 pr-4 py-4 outline-none border border-white/20 focus:border-primary-400 focus:bg-white/15 transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl px-6 py-4 bg-[#226A74] text-white font-semibold hover:from-primary-700 hover:to-accent-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Continue
            </button>
          </form>

          {/* Error Message */}
          {msg && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-sm text-red-300 text-center">{msg}</p>
            </div>
          )}

          {/* Footer Links */}
          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <a href="/login" className="text-primary-400 hover:text-primary-300 font-semibold underline underline-offset-2 transition-colors">
              Sign up
            </a>
            {' '}•{' '}
            <a href="#" className="text-slate-500 hover:text-slate-400 cursor-not-allowed transition-colors">
              Forgot password?
            </a>
          </p>
        </div>

        {/* Bottom Text */}
        <p className="mt-8 text-center text-sm text-slate-400">
          By continuing, you agree to our{' '}
          <a href="#" className="text-primary-400 hover:text-primary-300 transition-colors">Terms</a>
          {' '}and{' '}
          <a href="#" className="text-primary-400 hover:text-primary-300 transition-colors">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
