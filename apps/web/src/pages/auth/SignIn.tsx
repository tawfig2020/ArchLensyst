import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Loader2 } from 'lucide-react';
import { useAuthStore, DEMO_ACCOUNTS } from '../../stores/authStore';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signInWithGoogle, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signIn(email, password);
    if (success) navigate('/dashboard');
  };

  const handleGoogle = async () => {
    const success = await signInWithGoogle();
    if (success) navigate('/dashboard');
  };

  const fillDemo = (email: string) => {
    const account = DEMO_ACCOUNTS[email];
    if (account) {
      setEmail(email);
      setPassword(account.password);
      clearError();
    }
  };

  return (
    <div className="min-h-screen bg-citadel-bg flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-citadel-surface via-citadel-elevated to-citadel-bg items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-sentinel-blue rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-md px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-purple flex items-center justify-center shadow-glow-blue">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">ArchLens</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Strategic Architecture Intelligence
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Enterprise-grade AI-powered codebase orchestration. Detect architectural drift,
            enforce invariants, and gain deep structural insights across your entire engineering organization.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {['AI Analysis', 'Zero-Trust', 'Real-time'].map((label) => (
              <div key={label} className="bg-citadel-surface/50 border border-citadel-border rounded-xl p-3">
                <p className="text-xs text-sentinel-blue font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-blue-purple flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">ArchLens</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm mb-8">Sign in to your ArchLens account</p>

          {error && (
            <div className="mb-6 p-4 bg-breach-red-glow border border-breach-red/30 rounded-xl text-breach-red text-sm">
              {error}
            </div>
          )}

          {/* Demo account quick-fill */}
          <div className="mb-6 p-4 bg-sentinel-blue-glow border border-sentinel-blue/20 rounded-xl">
            <p className="text-xs text-sentinel-blue font-semibold mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fillDemo('pro@archlens.io')}
                className="text-xs px-3 py-2 bg-citadel-surface border border-citadel-border rounded-lg text-gray-300 hover:border-sentinel-blue hover:text-white transition-all"
              >
                <span className="block font-semibold text-sentinel-blue">Pro Account</span>
                pro@archlens.io
              </button>
              <button
                onClick={() => fillDemo('institution@archlens.io')}
                className="text-xs px-3 py-2 bg-citadel-surface border border-citadel-border rounded-lg text-gray-300 hover:border-purple-400 hover:text-white transition-all"
              >
                <span className="block font-semibold text-purple-400">Institution</span>
                institution@archlens.io
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-citadel-surface border border-citadel-border rounded-xl text-white placeholder-gray-500 focus:border-sentinel-blue focus:ring-1 focus:ring-sentinel-blue/50 outline-none transition-all"
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-citadel-surface border border-citadel-border rounded-xl text-white placeholder-gray-500 focus:border-sentinel-blue focus:ring-1 focus:ring-sentinel-blue/50 outline-none transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input type="checkbox" className="rounded border-citadel-border bg-citadel-surface accent-sentinel-blue" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-sentinel-blue hover:text-sentinel-blue-hover transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-purple hover:bg-blue-purple-hover text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-glow-blue"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-citadel-border" />
            <span className="text-xs text-gray-500">or continue with</span>
            <div className="flex-1 h-px bg-citadel-border" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full py-3 bg-citadel-surface border border-citadel-border rounded-xl text-gray-300 font-medium hover:border-citadel-border-hover hover:text-white transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-sentinel-blue hover:text-sentinel-blue-hover font-medium transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
