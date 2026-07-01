import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { topOpportunities } from '../data/mockData';
import { BarChart3, TrendingUp, Zap, ChevronRight, ArrowUpRight, ArrowDownRight, Star, Eye, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { user, remainingSignals, liveAssets, isLiveLoading, lastPriceUpdate, refreshPrices } = useApp();
  const navigate = useNavigate();

  const trendingAssets = liveAssets.filter(a => Math.abs(a.change24h) > 1).slice(0, 4);
  const watchlistAssets = liveAssets.filter(a => user?.watchlist?.includes(a.id));
  const fmt = (p: number) => p < 0.001 ? p.toExponential(4) : p < 10 ? p.toFixed(4) : p.toLocaleString(undefined, { maximumFractionDigits: 2 });

  const planNames: Record<string, string> = { free: 'Free', starter: 'Starter', active: 'Active Trader', pro: 'Pro Trader', unlimited: 'Unlimited' };

  return (
    <div className="p-4 space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Welcome, {user?.name?.split(' ')[0] || 'Trader'} 👋</h1>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            Live Market Overview
            <button onClick={refreshPrices}><RefreshCw className={`w-3 h-3 ${isLiveLoading ? 'animate-spin' : ''}`} /></button>
            {lastPriceUpdate && <span className="text-[10px] text-gray-600">Updated: {lastPriceUpdate.toLocaleTimeString()}</span>}
          </p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-green-400 font-semibold">LIVE</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
          <Zap className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <p className="text-lg font-bold">{remainingSignals === -1 ? '∞' : remainingSignals}</p>
          <p className="text-[10px] text-gray-500">Signals Left</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
          <BarChart3 className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <p className="text-lg font-bold">4</p>
          <p className="text-[10px] text-gray-500">Markets</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
          <TrendingUp className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <p className="text-lg font-bold">{watchlistAssets.length}</p>
          <p className="text-[10px] text-gray-500">Watchlist</p>
        </div>
      </div>

      {/* Quick Action */}
      <button onClick={() => navigate('/markets')} className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-cyan-500/20">
        <Zap className="w-5 h-5" /> Get AI Signal
      </button>

      {/* Plan Status */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500">Current Plan</p>
            <p className="font-bold">{planNames[user?.plan || 'free']}</p>
          </div>
          {user?.plan === 'free' && (
            <button onClick={() => navigate('/pricing')} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
              Upgrade
            </button>
          )}
        </div>
        {user?.plan !== 'unlimited' && (
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (signalsUsedPercent(user) ))}%` }} />
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          {remainingSignals === -1 ? 'Unlimited signals available' : `${remainingSignals} of ${getSignalTotal(user)} signals remaining`}
        </p>
      </div>

      {/* Top Opportunities */}
      {(user?.plan === 'pro' || user?.plan === 'unlimited' || user?.isAdmin) && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">🔥 Top Opportunities</h2>
            <span className="text-xs text-cyan-400 font-medium">Live</span>
          </div>
          <div className="space-y-2">
            {topOpportunities.map((opp, i) => (
              <button key={opp.assetId} onClick={() => navigate(`/markets/${opp.assetId}`)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-cyan-500/30 transition">
                <span className="text-lg font-bold text-gray-600 w-6">{i + 1}</span>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">{opp.symbol}</p>
                  <p className="text-xs text-gray-500">{opp.name}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${opp.action === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {opp.action.toUpperCase()}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{opp.confidence}% conf.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Assets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">📈 Trending Now</h2>
          <button onClick={() => navigate('/markets')} className="text-xs text-cyan-400 font-medium">See All</button>
        </div>
        <div className="space-y-2">
          {trendingAssets.map(asset => (
            <button key={asset.id} onClick={() => navigate(`/markets/${asset.id}`)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-cyan-500/30 transition">
              <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-lg">
                {asset.market === 'crypto' ? '₿' : asset.market === 'gold' ? '🥇' : asset.market === 'oil' ? '🛢️' : '🥈'}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm">{asset.symbol}</p>
                <p className="text-xs text-gray-500">{asset.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono font-semibold">${fmt(asset.price)}</p>
                <p className={`text-xs font-medium flex items-center justify-end gap-0.5 ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.change24h >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(asset.change24h).toFixed(2)}%
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Watchlist Preview */}
      {watchlistAssets.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">⭐ Watchlist</h2>
            <button onClick={() => navigate('/watchlist')} className="text-xs text-cyan-400 font-medium">See All</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {watchlistAssets.slice(0, 4).map(asset => (
              <button key={asset.id} onClick={() => navigate(`/markets/${asset.id}`)} className="p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-cyan-500/30 transition text-left">
                <div className="flex items-center justify-between mb-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <Eye className="w-4 h-4 text-gray-600" />
                </div>
                <p className="font-semibold text-sm">{asset.symbol}</p>
                <p className="text-xs text-gray-500">${fmt(asset.price)}</p>
                <p className={`text-xs font-medium ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3 pb-4">
        <button onClick={() => navigate('/history')} className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-left hover:border-cyan-500/30 transition">
          <span className="text-2xl mb-2 block">📋</span>
          <p className="font-semibold text-sm">Signal History</p>
          <p className="text-xs text-gray-500">View past signals</p>
        </button>
        <button onClick={() => navigate('/learn')} className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-left hover:border-cyan-500/30 transition">
          <span className="text-2xl mb-2 block">📚</span>
          <p className="font-semibold text-sm">Learn</p>
          <p className="text-xs text-gray-500">Improve your skills</p>
        </button>
      </div>
    </div>
  );
}

function signalsUsedPercent(user: any): number {
  const total = getSignalTotal(user);
  if (total <= 0) return 0;
  return Math.min(100, ((user?.signalsUsed || 0) / total) * 100);
}

function getSignalTotal(user: any): number {
  switch (user?.plan) {
    case 'free': return 3;
    case 'starter': return 12;
    case 'active': return 25;
    case 'pro': return 120;
    default: return 3;
  }
}
