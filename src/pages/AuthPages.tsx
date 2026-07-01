import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Zap, Eye, EyeOff, ArrowRight, Mail, Lock, User } from 'lucide-react';

export default function AuthPages({ mode }: { mode: 'login' | 'signup' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    await new Promise(r => setTimeout(r, 800));

    if (mode === 'login') {
      const success = login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Try admin@trendora.com / Trendora2024!');
      }
    } else {
      if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
      const success = signup(name, email, password);
      if (success) {
        navigate('/onboarding');
      } else {
        setError('An account with this email already exists');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Trendora</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-gray-400 text-sm">
            {mode === 'login' ? 'Sign in to access your signals dashboard' : 'Start with 3 free AI signals — no credit card needed'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-900/80 backdrop-blur-lg border border-gray-800 rounded-2xl p-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition" />
              </div>
            </div>
          )}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="w-full pl-10 pr-12 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPass ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">{error}</div>
          )}

          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center text-sm text-gray-500">
            {mode === 'login' ? (
              <>Don't have an account? <button type="button" onClick={() => navigate('/signup')} className="text-cyan-400 hover:underline">Sign Up</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={() => navigate('/login')} className="text-cyan-400 hover:underline">Sign In</button></>
            )}
          </div>
        </form>

        {/* Master account hint */}
        <div className="mt-4 bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">🔥 Demo Master Account</p>
          <p className="text-xs text-gray-400 font-mono">admin@trendora.com / Trendora2024!</p>
          <p className="text-xs text-gray-600 mt-1">Full unlimited access + Admin panel</p>
        </div>
      </div>
    </div>
  );
}
