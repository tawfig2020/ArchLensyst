import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Loader2, Check } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, signInWithGoogle, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const requirements = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'One uppercase', met: /[A-Z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signUp(name, email, password);
    if (success) navigate('/dashboard');
  };

  const handleGoogle = async () => {
    const success = await signInWithGoogle();
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-citadel-bg flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-blue-purple flex items-center justify-center shadow-glow-blue">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">ArchLens</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2 text-center">Create your account</h1>
        <p className="text-gray-400 text-sm mb-8 text-center">Start your free trial — no credit card required</p>

        {error && (
          <div className="mb-6 p-4 bg-breach-red-glow border border-breach-red/30 rounded-xl text-breach-red text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogle}
          disabled={isLoading}
          className="w-full py-3 bg-citadel-surface border border-citadel-border rounded-xl text-gray-300 font-medium hover:border-citadel-border-hover hover:text-white transition-all flex items-center justify-center gap-3 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-citadel-border" />
          <span className="text-xs text-gray-500">or</span>
          <div className="flex-1 h-px bg-citadel-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-citadel-surface border border-citadel-border rounded-xl text-white placeholder-gray-500 focus:border-sentinel-blue focus:ring-1 focus:ring-sentinel-blue/50 outline-none transition-all"
              placeholder="Alex Rivera"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Work email</label>
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
                placeholder="Create a strong password"
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
            <div className="flex gap-3 mt-2">
              {requirements.map((r) => (
                <span key={r.label} className={`flex items-center gap-1 text-xs ${r.met ? 'text-invariant-green' : 'text-gray-500'}`}>
                  <Check className={`w-3 h-3 ${r.met ? 'opacity-100' : 'opacity-30'}`} /> {r.label}
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !requirements.every((r) => r.met)}
            className="w-full py-3 bg-blue-purple hover:bg-blue-purple-hover text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-glow-blue"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          By signing up, you agree to our{' '}
          <a href="#" className="text-sentinel-blue hover:underline">Terms</a> and{' '}
          <a href="#" className="text-sentinel-blue hover:underline">Privacy Policy</a>.
        </p>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/signin" className="text-sentinel-blue hover:text-sentinel-blue-hover font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
