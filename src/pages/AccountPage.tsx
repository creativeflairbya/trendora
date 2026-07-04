import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { supportedLanguages } from '../data/mockData';
import { CreditCard, Shield, Bell, Globe, LogOut, ChevronRight, Moon, Sun, Mail, Calendar, Key } from 'lucide-react';
import { useState } from 'react';

export default function AccountPage() {
  const { user, isDark, toggleTheme, language, setLanguage, logout, remainingSignals } = useApp();
  const navigate = useNavigate();
  const [showLangModal, setShowLangModal] = useState(false);

  const planNames: Record<string, string> = { free: 'Free', starter: 'Starter', active: 'Active Trader', pro: 'Pro Trader', unlimited: 'Unlimited' };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentLang = supportedLanguages.find(l => l.code === language);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Account</h1>

      {/* Profile Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-lg">{user?.name}</h2>
            <p className="text-sm text-gray-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-500">Plan</p>
            <p className="font-bold text-sm">{planNames[user?.plan || 'free']}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-500">Signals Left</p>
            <p className="font-bold text-sm text-cyan-400">{remainingSignals === -1 ? '∞' : remainingSignals}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-500">Member Since</p>
            <p className="font-bold text-sm flex items-center gap-1"><Calendar className="w-3 h-3" /> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-500">Role</p>
            <p className="font-bold text-sm">{user?.isAdmin ? '👑 Admin' : 'Trader'}</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-3 border-b border-gray-800">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</p>
        </div>
        <button onClick={toggleTheme} className="w-full flex items-center gap-3 p-4 hover:bg-gray-800/50 transition border-b border-gray-800/50">
          {isDark ? <Moon className="w-5 h-5 text-gray-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
          <span className="flex-1 text-left text-sm">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
          <div className={`w-10 h-6 rounded-full transition ${isDark ? 'bg-cyan-500' : 'bg-gray-600'} relative`}>
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${isDark ? 'right-1' : 'left-1'}`} />
          </div>
        </button>
        <button onClick={() => setShowLangModal(true)} className="w-full flex items-center gap-3 p-4 hover:bg-gray-800/50 transition border-b border-gray-800/50">
          <Globe className="w-5 h-5 text-gray-400" />
          <span className="flex-1 text-left text-sm">Language</span>
          <span className="text-sm text-gray-400">{currentLang?.flag} {currentLang?.name}</span>
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
        <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-800/50 transition border-b border-gray-800/50">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="flex-1 text-left text-sm">Notifications</span>
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
        <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-800/50 transition border-b border-gray-800/50">
          <Shield className="w-5 h-5 text-gray-400" />
          <span className="flex-1 text-left text-sm">Security</span>
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Billing */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-3 border-b border-gray-800">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Billing</p>
        </div>
        <button onClick={() => navigate('/pricing')} className="w-full flex items-center gap-3 p-4 hover:bg-gray-800/50 transition border-b border-gray-800/50">
          <CreditCard className="w-5 h-5 text-gray-400" />
          <span className="flex-1 text-left text-sm">Change Plan</span>
          <span className="text-sm text-cyan-400">{planNames[user?.plan || 'free']}</span>
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
        <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-800/50 transition border-b border-gray-800/50">
          <Key className="w-5 h-5 text-gray-400" />
          <span className="flex-1 text-left text-sm">Payment Methods</span>
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
        <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-800/50 transition">
          <CreditCard className="w-5 h-5 text-gray-400" />
          <span className="flex-1 text-left text-sm">Billing History</span>
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Admin Quick Access */}
      {user?.isAdmin && (
        <button onClick={() => navigate('/admin')} className="w-full bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 hover:bg-red-500/20 transition">
          <Shield className="w-5 h-5 text-red-400" />
          <div className="flex-1 text-left">
            <p className="font-bold text-sm text-red-400">Admin Dashboard</p>
            <p className="text-xs text-gray-500">Full admin access</p>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400" />
        </button>
      )}

      {/* Danger Zone */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 hover:bg-red-500/10 transition">
          <LogOut className="w-5 h-5 text-red-400" />
          <span className="flex-1 text-left text-sm text-red-400">Log Out</span>
        </button>
      </div>

      <p className="text-center text-xs text-gray-600 pb-4">SignalAnalyst AI v1.0.0 · Security-First Architecture</p>

      {/* Language Modal */}
      {showLangModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70">
          <div className="bg-gray-900 border-t border-gray-700 rounded-t-2xl w-full max-w-md max-h-[70vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-bold">Select Language</h3>
              <button onClick={() => setShowLangModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="p-3 space-y-1">
              {supportedLanguages.map(lang => (
                <button key={lang.code} onClick={() => { setLanguage(lang.code); setShowLangModal(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition text-left ${language === lang.code ? 'bg-cyan-500/10 border border-cyan-500/30' : 'hover:bg-gray-800'}`}>
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                  {language === lang.code && <span className="ml-auto text-cyan-400 text-sm">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
