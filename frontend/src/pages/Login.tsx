// frontend/src/pages/Login.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/auth';

export default function Login() {
  const { t } = useTranslation();
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
    <div className="min-h-screen flex items-center justify-center bg-[#0f3b40]">
      <div className="bg-[#0f3b40] p-8 rounded-lg w-full max-w-lg">
        <div className="flex justify-center mb-10">
          <div className="text-3xl font-bold text-white">Hirely</div>
        </div>

        <div className="bg-[#0f3b40] border border-white/10 rounded-xl p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold text-white text-center mb-6">
            Welcome to Hirely
          </h1>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 bg-white text-gray-800 font-medium hover:bg-gray-100 transition disabled:opacity-70"
          >
            {/* Google icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.84h5.46c-.24 1.26-1.47 3.69-5.46 3.69A6.32 6.32 0 0 1 5.7 11.4a6.32 6.32 0 0 1 6.3-6.33c1.8 0 3.02.78 3.72 1.44l2.53-2.45C16.9 2.5 14.66 1.6 12 1.6 6.98 1.6 2.96 5.62 2.96 10.64S6.98 19.68 12 19.68c7.2 0 8.64-5.02 8.64-7.53 0-.5-.05-.86-.12-1.22H12z"/>
            </svg>
            {loading ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <form className="mt-6 space-y-4" onSubmit={handleContinue}>
            <input
              type="email"
              placeholder="Enter email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-white/10 text-white placeholder-white/60 px-4 py-3 outline-none border border-white/10 focus:border-white/30"
            />
            <input
              type="password"
              placeholder="Enter password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="w-full rounded-md bg-white/10 text-white placeholder-white/60 px-4 py-3 outline-none border border-white/10 focus:border-white/30"
            />

            <button
              type="submit"
              className="w-full rounded-md px-4 py-3 bg-black text-white font-medium hover:bg-black/90 transition"
            >
              Continue
            </button>
          </form>

          {msg && (
            <p className="mt-4 text-sm text-center text-red-300">{msg}</p>
          )}

          <p className="mt-6 text-center text-sm text-white/70">
            Already have an account?{' '}
            <a href="/login" className="text-white underline underline-offset-2">
              Sign in
            </a>
            {' '}•{' '}
            <a href="#" className="text-white/70 cursor-not-allowed">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
