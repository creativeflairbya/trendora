import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, PlanType, Notification, Signal, Asset } from '../types';
import { sampleNotifications, sampleSignals } from '../data/mockData';
import { getBaselineAssets, fetchLiveCryptoPrices, applyLivePrices } from '../services/marketService';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isDark: boolean;
  toggleTheme: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  signalHistory: Signal[];
  addSignalToHistory: (signal: Signal) => void;
  signalsUsed: number;
  useSignal: () => boolean;
  remainingSignals: number;
  logout: () => void;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  liveAssets: Asset[];
  isLiveLoading: boolean;
  lastPriceUpdate: Date | null;
  refreshPrices: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const MASTER_EMAIL = 'admin@trendora.com';
const MASTER_PASSWORD = 'Trendora2024!';

const masterUser: User = {
  id: 'master-001',
  email: MASTER_EMAIL,
  name: 'Trendora Admin',
  plan: 'unlimited',
  signalsUsed: 0,
  signalsTotal: -1,
  language: 'en',
  createdAt: '2024-01-01',
  isAdmin: true,
  watchlist: ['btc', 'xauusd', 'sol', 'xagusd', 'eth', 'wti'],
};

function getStoredUsers(): Record<string, { name: string; password: string; user: User }> {
  try { return JSON.parse(localStorage.getItem('trendora_users') || '{}'); } catch { return {}; }
}

function storeUser(email: string, name: string, password: string, user: User) {
  const users = getStoredUsers();
  users[email] = { name, password, user };
  localStorage.setItem('trendora_users', JSON.stringify(users));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('trendora_theme') === 'dark' ? true : localStorage.getItem('trendora_theme') === 'light' ? false : true);
  const [language, setLanguage] = useState(() => localStorage.getItem('trendora_lang') || 'en');
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [signalHistory, setSignalHistory] = useState<Signal[]>(sampleSignals.slice(0, 3));
  const [signalsUsed, setSignalsUsed] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    try { const s = localStorage.getItem('trendora_current_user'); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [liveAssets, setLiveAssets] = useState<Asset[]>(getBaselineAssets());
  const [isLiveLoading, setIsLiveLoading] = useState(true);
  const [lastPriceUpdate, setLastPriceUpdate] = useState<Date | null>(null);

  // Fetch live prices
  const refreshPrices = async () => {
    setIsLiveLoading(true);
    try {
      const baseline = getBaselineAssets();
      const liveData = await fetchLiveCryptoPrices();
      const merged = applyLivePrices(baseline, liveData);
      setLiveAssets(merged);
      setLastPriceUpdate(new Date());
    } catch (e) {
      console.warn('Price refresh failed, using baseline:', e);
      setLiveAssets(getBaselineAssets());
    }
    setIsLiveLoading(false);
  };

  useEffect(() => { refreshPrices(); }, []);
  useEffect(() => { const interval = setInterval(refreshPrices, 60000); return () => clearInterval(interval); }, []);

  useEffect(() => { localStorage.setItem('trendora_theme', isDark ? 'dark' : 'light'); document.documentElement.classList.toggle('dark', isDark); }, [isDark]);
  useEffect(() => { localStorage.setItem('trendora_lang', language); }, [language]);
  useEffect(() => { if (user) localStorage.setItem('trendora_current_user', JSON.stringify(user)); else localStorage.removeItem('trendora_current_user'); }, [user]);

  const toggleTheme = () => setIsDark(!isDark);
  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const addSignalToHistory = (signal: Signal) => setSignalHistory(prev => [signal, ...prev]);

  const getSignalLimit = (plan: PlanType): number => {
    switch (plan) { case 'free': return 3; case 'starter': return 12; case 'active': return 25; case 'pro': return 120; case 'unlimited': return -1; }
  };
  const remainingSignals = user ? (user.plan === 'unlimited' ? -1 : getSignalLimit(user.plan) - signalsUsed) : 0;

  const useSignal = (): boolean => {
    if (!user) return false;
    if (user.plan === 'unlimited') { setSignalsUsed(prev => prev + 1); return true; }
    if (remainingSignals <= 0) { setShowUpgradeModal(true); return false; }
    setSignalsUsed(prev => prev + 1);
    setUser(prev => prev ? { ...prev, signalsUsed: prev.signalsUsed + 1 } : null);
    return true;
  };

  const login = (email: string, password: string): boolean => {
    if (email === MASTER_EMAIL && password === MASTER_PASSWORD) { setUser(masterUser); setSignalsUsed(0); return true; }
    const users = getStoredUsers();
    const userData = users[email];
    if (userData && userData.password === password) { setUser(userData.user); setSignalsUsed(userData.user.signalsUsed); return true; }
    return false;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    const users = getStoredUsers();
    if (users[email]) return false;
    const newUser: User = { id: `user-${Date.now()}`, email, name, plan: 'free', signalsUsed: 0, signalsTotal: 3, language: 'en', createdAt: new Date().toISOString(), isAdmin: false, watchlist: [] };
    storeUser(email, name, password, newUser);
    setUser(newUser);
    setSignalsUsed(0);
    return true;
  };

  const logout = () => { setUser(null); setSignalsUsed(0); setSignalHistory([]); localStorage.removeItem('trendora_current_user'); };

  return (
    <AppContext.Provider value={{
      user, setUser, isDark, toggleTheme, language, setLanguage,
      notifications, markNotificationRead, signalHistory, addSignalToHistory,
      signalsUsed, useSignal, remainingSignals, logout, showUpgradeModal,
      setShowUpgradeModal, login, signup, liveAssets, isLiveLoading,
      lastPriceUpdate, refreshPrices,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
