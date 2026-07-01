import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import AuthPages from './pages/AuthPages';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import MarketsPage from './pages/MarketsPage';
import PricingPage from './pages/PricingPage';
import SignalHistoryPage from './pages/SignalHistoryPage';
import WatchlistPage from './pages/WatchlistPage';
import LearnPage from './pages/LearnPage';
import AccountPage from './pages/AccountPage';
import AdminDashboard from './pages/AdminDashboard';
import AppLayout from './components/AppLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" />;
  if (!user.isAdmin) return <Navigate to="/dashboard" />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useApp();
  const location = useLocation();
  const isLanding = location.pathname === '/' || location.pathname === '/pricing-info';
  const isAuth = location.pathname === '/login' || location.pathname === '/signup';

  if (isLanding || isAuth) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing-info" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <AuthPages mode="login" />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <AuthPages mode="signup" />} />
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/markets" element={<ProtectedRoute><MarketsPage /></ProtectedRoute>} />
        <Route path="/markets/:assetId" element={<ProtectedRoute><MarketsPage /></ProtectedRoute>} />
        <Route path="/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><SignalHistoryPage /></ProtectedRoute>} />
        <Route path="/watchlist" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen bg-gray-950 text-white">
          <AppRoutes />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}
