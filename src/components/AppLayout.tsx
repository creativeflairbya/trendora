import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Home, BarChart3, Clock, Star, BookOpen, User, Shield, Bell, X, Zap, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, notifications, showUpgradeModal, setShowUpgradeModal, remainingSignals } = useApp();
  const navigate = useNavigate();
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/markets', icon: BarChart3, label: 'Markets' },
    { to: '/history', icon: Clock, label: 'History' },
    { to: '/watchlist', icon: Star, label: 'Watchlist' },
    { to: '/learn', icon: BookOpen, label: 'Learn' },
  ];

  const planNames: Record<string, string> = { free: 'Free', starter: 'Starter', active: 'Active', pro: 'Pro', unlimited: 'Unlimited' };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col max-w-md mx-auto relative">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Trendora</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Signal Counter */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-800 text-xs">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-400 font-semibold">{remainingSignals === -1 ? '∞' : remainingSignals}</span>
            </div>
            {/* Notifications */}
            <button onClick={() => setShowNotifPanel(!showNotifPanel)} className="relative p-1.5 rounded-lg hover:bg-gray-800 transition">
              <Bell className="w-5 h-5 text-gray-400" />
              {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">{unreadCount}</span>}
            </button>
            {/* Account */}
            <button onClick={() => navigate('/account')} className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </button>
          </div>
        </div>
        {/* Plan Badge */}
        <div className="px-4 pb-2 flex items-center gap-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            user?.plan === 'unlimited' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' :
            user?.plan === 'pro' ? 'bg-purple-500/20 text-purple-400' :
            user?.plan === 'active' ? 'bg-blue-500/20 text-blue-400' :
            user?.plan === 'starter' ? 'bg-green-500/20 text-green-400' :
            'bg-gray-700 text-gray-400'
          }`}>
            {planNames[user?.plan || 'free']} Plan
          </span>
          {user?.isAdmin && (
            <button onClick={() => navigate('/admin')} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Admin
            </button>
          )}
        </div>
      </header>

      {/* Notification Panel */}
      {showNotifPanel && (
        <div className="absolute top-16 right-2 z-50 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-gray-800">
            <span className="font-semibold text-sm">Notifications</span>
            <button onClick={() => setShowNotifPanel(false)}><X className="w-4 h-4 text-gray-400" /></button>
          </div>
          {notifications.map(n => (
            <div key={n.id} className={`p-3 border-b border-gray-800/50 ${n.read ? 'opacity-60' : ''}`} onClick={() => {}}>
              <div className="flex items-start gap-2">
                <span className="text-sm">{n.type === 'signal' ? '📊' : n.type === 'alert' ? '🔔' : n.type === 'billing' ? '💳' : 'ℹ️'}</span>
                <div>
                  <p className="text-xs font-semibold">{n.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{n.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4">
                <ChevronUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Upgrade Your Plan</h3>
              <p className="text-gray-400 text-sm mb-6">You've used all your signal credits. Upgrade to get more signals and unlock premium features.</p>
              <button onClick={() => { setShowUpgradeModal(false); navigate('/pricing'); }} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition mb-3">
                View Plans
              </button>
              <button onClick={() => setShowUpgradeModal(false)} className="w-full py-3 rounded-xl bg-gray-800 text-gray-400 font-medium hover:bg-gray-700 transition">
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 z-40">
        <div className="flex items-center justify-around py-2">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition ${isActive ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
          <button onClick={() => navigate('/account')} className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-500 hover:text-gray-300 transition">
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Account</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
