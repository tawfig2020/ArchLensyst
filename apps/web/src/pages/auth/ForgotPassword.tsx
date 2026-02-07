import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Loader2, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setIsLoading(false);
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

        {sent ? (
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 bg-invariant-green-glow border border-invariant-green/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-invariant-green" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
            <p className="text-gray-400 text-sm mb-8">
              We sent a password reset link to <span className="text-white font-medium">{email}</span>.
              Check your inbox and follow the instructions.
            </p>
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 text-sentinel-blue hover:text-sentinel-blue-hover font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-2 text-center">Reset your password</h1>
            <p className="text-gray-400 text-sm mb-8 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-citadel-surface border border-citadel-border rounded-xl text-white placeholder-gray-500 focus:border-sentinel-blue focus:ring-1 focus:ring-sentinel-blue/50 outline-none transition-all"
                  placeholder="you@company.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-purple hover:bg-blue-purple-hover text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-glow-blue"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
              <Link to="/signin" className="inline-flex items-center gap-1 text-sentinel-blue hover:text-sentinel-blue-hover font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
