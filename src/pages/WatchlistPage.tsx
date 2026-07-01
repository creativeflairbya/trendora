import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { assets } from '../data/mockData';
import { Star, Plus, Bell, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function WatchlistPage() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const watchlist = user?.watchlist || [];
  const watchlistAssets = assets.filter(a => watchlist.includes(a.id));
  const otherAssets = assets.filter(a => !watchlist.includes(a.id));

  const toggleWatchlist = (assetId: string) => {
    if (!user) return;
    const newWatchlist = watchlist.includes(assetId)
      ? watchlist.filter((id: string) => id !== assetId)
      : [...watchlist, assetId];
    setUser({ ...user, watchlist: newWatchlist });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Watchlist</h1>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/30 transition">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {watchlistAssets.length === 0 ? (
        <div className="text-center py-12">
          <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="font-bold text-gray-400">No Watchlist Items</h3>
          <p className="text-sm text-gray-500 mt-1">Add assets to your watchlist to track them easily</p>
          <button onClick={() => setShowAddModal(true)} className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold">
            Add Assets
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {watchlistAssets.map(asset => (
            <div key={asset.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-cyan-500/30 transition">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleWatchlist(asset.id)} className="flex-shrink-0">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                </button>
                <button onClick={() => navigate(`/markets/${asset.id}`)} className="flex-1 text-left flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-lg">
                    {asset.market === 'crypto' ? '₿' : asset.market === 'gold' ? '🥇' : asset.market === 'oil' ? '🛢️' : '🥈'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{asset.symbol}</p>
                    <p className="text-xs text-gray-500">{asset.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-semibold">${asset.price.toLocaleString()}</p>
                    <p className={`text-xs font-medium flex items-center justify-end gap-0.5 ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {asset.change24h >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(asset.change24h).toFixed(2)}%
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              {/* Alert Settings */}
              {(user?.plan === 'active' || user?.plan === 'pro' || user?.plan === 'unlimited' || user?.isAdmin) && (
                <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-2">
                  <Bell className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">Price alerts active</span>
                  <span className="text-xs text-cyan-400 ml-auto cursor-pointer">Configure</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70">
          <div className="bg-gray-900 border-t border-gray-700 rounded-t-2xl w-full max-w-md max-h-[70vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-bold">Add to Watchlist</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="p-3 space-y-2">
              {otherAssets.map(asset => (
                <button key={asset.id} onClick={() => { toggleWatchlist(asset.id); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-cyan-500/30 transition text-left">
                  <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-sm">
                    {asset.market === 'crypto' ? '₿' : asset.market === 'gold' ? '🥇' : asset.market === 'oil' ? '🛢️' : '🥈'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{asset.symbol}</p>
                    <p className="text-xs text-gray-500">{asset.name}</p>
                  </div>
                  <Plus className="w-4 h-4 text-cyan-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
