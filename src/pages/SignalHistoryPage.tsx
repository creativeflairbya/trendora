import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Clock, ChevronRight, Filter } from 'lucide-react';
import { useState } from 'react';
import { Market } from '../types';

export default function SignalHistoryPage() {
  const { signalHistory } = useApp();
  const navigate = useNavigate();
  const [filterMarket, setFilterMarket] = useState<Market | 'all'>('all');

  const filtered = filterMarket === 'all' ? signalHistory : signalHistory.filter(s => s.market === filterMarket);
  const marketTabs: { key: Market | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'crypto', label: '₿ Crypto' },
    { key: 'gold', label: '🥇 Gold' },
    { key: 'oil', label: '🛢️ Oil' },
    { key: 'silver', label: '🥈 Silver' },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Signal History</h1>
        <Filter className="w-5 h-5 text-gray-400" />
      </div>

      {/* Market Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {marketTabs.map(tab => (
          <button key={tab.key} onClick={() => setFilterMarket(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${filterMarket === tab.key ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* History List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="font-bold text-gray-400">No Signals Yet</h3>
          <p className="text-sm text-gray-500 mt-1">Start analyzing markets to see your signal history</p>
          <button onClick={() => navigate('/markets')} className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold">
            Get Your First Signal
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(signal => (
            <div key={signal.id} onClick={() => navigate(`/markets/${signal.assetId}`)}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-cyan-500/30 transition cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{signal.assetSymbol}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${signal.action === 'buy' ? 'bg-green-500/20 text-green-400' : signal.action === 'sell' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {signal.action.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{signal.assetName} · {signal.timeframe}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-bold text-cyan-400">{signal.confidence}%</p>
                    <p className="text-[10px] text-gray-500">confidence</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-gray-800/50 rounded-lg p-2">
                  <p className="text-[10px] text-gray-500">Risk</p>
                  <p className={`text-xs font-semibold ${signal.risk === 'low' ? 'text-green-400' : signal.risk === 'medium' ? 'text-amber-400' : 'text-red-400'}`}>
                    {signal.risk.charAt(0).toUpperCase() + signal.risk.slice(1)}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2">
                  <p className="text-[10px] text-gray-500">Success</p>
                  <p className="text-xs font-semibold text-green-400">{signal.similarSetupSuccess}%</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2">
                  <p className="text-[10px] text-gray-500">Status</p>
                  <p className={`text-xs font-semibold ${signal.marketStatus === 'favorable' ? 'text-green-400' : signal.marketStatus === 'neutral' ? 'text-amber-400' : 'text-red-400'}`}>
                    {signal.marketStatus}
                  </p>
                </div>
              </div>

              {signal.action !== 'wait' && (
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Entry: ${signal.entryZone[0].toLocaleString()}</span>
                  <span>SL: <span className="text-red-400">${signal.stopLoss.toLocaleString()}</span></span>
                  <span>TP1: <span className="text-green-400">${signal.takeProfit1.toLocaleString()}</span></span>
                </div>
              )}

              <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                {new Date(signal.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
