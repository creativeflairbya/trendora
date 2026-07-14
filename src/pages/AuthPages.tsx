import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Zap, Eye, EyeOff, ArrowRight, Mail, Lock, User, Phone, KeyRound } from 'lucide-react';

export default function AuthPages({ mode }: { mode: 'login' | 'signup' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
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
        setError('Invalid email or password. Use password reset if you need account recovery.');
      }
    } else {
      if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
      if (!phone.trim()) { setError('Phone number is required'); setLoading(false); return; }
      if (codeSent && phoneCode !== '123456') { setError('Invalid verification code. Demo code is 123456'); setLoading(false); return; }
      const success = signup(name, email, password);
      if (success) {
        navigate('/onboarding');
      } else {
        setError('An account with this email already exists');
      }
    }
    setLoading(false);
  };

  const sendResetLink = async () => {
    if (!resetEmail.trim()) {
      setError('Enter your email address to receive a reset link.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/v1/password-reset', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Reset email failed');
      setError(payload.emailSent ? `Password reset link sent to ${resetEmail}.` : `Reset link generated. Configure SMTP to send emails automatically. Link: ${payload.resetUrl}`);
    } catch (err: any) {
      setError(err.message || 'Password reset is not configured yet.');
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
            <span className="font-bold text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SignalAnalyst AI</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-gray-400 text-sm">
            {mode === 'login' ? 'Sign in to access your signals dashboard' : 'Start with 3 free AI signals — no credit card needed'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-900/80 backdrop-blur-lg border border-gray-800 rounded-2xl p-6 space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Phone Number</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+92 300 0000000" className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition" />
                  </div>
                  <button type="button" onClick={() => setCodeSent(true)} className="px-3 rounded-xl bg-cyan-500 text-gray-950 text-xs font-bold">Send Code</button>
                </div>
              </div>
              {codeSent && (
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Verification Code</label>
                  <input value={phoneCode} onChange={e => setPhoneCode(e.target.value)} placeholder="123456" className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition" />
                  <p className="text-[10px] text-gray-500 mt-1">Demo verification code: 123456. Connect SMS provider in production.</p>
                </div>
              )}
            </>
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

          {mode === 'login' && (
            <button type="button" onClick={() => setShowReset(!showReset)} className="w-full text-xs text-cyan-400 hover:underline flex items-center justify-center gap-1">
              <KeyRound className="w-3 h-3" /> Forgot or change password?
            </button>
          )}

          {showReset && (
            <div className="rounded-xl bg-gray-800/70 border border-gray-700 p-3 space-y-2">
              <p className="text-xs text-gray-400">Password reset / master access recovery</p>
              <input value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="Enter your email" className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm outline-none focus:border-cyan-500" />
              <button type="button" onClick={sendResetLink} className="w-full py-2 rounded-lg bg-cyan-500 text-gray-950 text-xs font-bold">Send Reset Link</button>
            </div>
          )}

          <div className="text-center text-sm text-gray-500">
            {mode === 'login' ? (
              <>Don't have an account? <button type="button" onClick={() => navigate('/signup')} className="text-cyan-400 hover:underline">Sign Up</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={() => navigate('/login')} className="text-cyan-400 hover:underline">Sign In</button></>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}
