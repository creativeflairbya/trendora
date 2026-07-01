import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sampleSignals, alternativeAssets } from '../data/mockData';
import { Market, Timeframe } from '../types';
import { CandleData, fetchExchangeCandles, generateCandleData, generateLiveSignal } from '../services/marketService';
import { Search, Zap, TrendingUp, TrendingDown, AlertTriangle, Shield, BarChart2, ArrowUpRight, ArrowDownRight, ChevronRight, Info, Layers, Eye, Clock, RefreshCw } from 'lucide-react';

export default function MarketsPage() {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const { useSignal, remainingSignals, user, addSignalToHistory, setShowUpgradeModal, liveAssets, isLiveLoading, lastPriceUpdate, refreshPrices } = useApp();
  const [activeMarket, setActiveMarket] = useState<Market>('crypto');
  const [selectedAssetId, setSelectedAssetId] = useState(assetId || 'btc');
  const [timeframe, setTimeframe] = useState<Timeframe>('4h');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [signalState, setSignalState] = useState<'idle' | 'loading' | 'result' | 'no_signal'>('idle');
  const [loadingStep, setLoadingStep] = useState(0);
  const [currentSignal, setCurrentSignal] = useState(sampleSignals[0]);
  const [chartData, setChartData] = useState<CandleData[] | null>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [signalHold, setSignalHold] = useState<Timeframe>('5m');

  useEffect(() => { if (assetId) setSelectedAssetId(assetId); }, [assetId]);

  const selectedAsset = liveAssets.find(a => a.id === selectedAssetId) || liveAssets[0];
  const filteredAssets = liveAssets.filter(a => {
    const matchMarket = a.market === activeMarket;
    const matchSearch = searchQuery ? a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || a.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchMarket && matchSearch;
  });

  // Fetch exchange candles when the asset or timeframe changes.
  useEffect(() => {
    let mounted = true;
    setChartData(null);
    setChartLoading(true);
    fetchExchangeCandles(selectedAssetId, timeframe).then(data => {
      if (mounted && data?.length) setChartData(data);
      if (mounted) setChartLoading(false);
    });
    return () => { mounted = false; };
  }, [selectedAssetId, timeframe]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      fetchExchangeCandles(selectedAssetId, timeframe).then(data => {
        if (data?.length) setChartData(data);
      });
    }, 8000);
    return () => window.clearInterval(timer);
  }, [selectedAssetId, timeframe]);

  const candleData = chartData?.length ? chartData : generateCandleData(selectedAsset.price, timeframe);
  const currentChartPrice = candleData[candleData.length - 1]?.close || selectedAsset.price;

  const loadingSteps = [
    { layer: 'L1: Market Data Engine', desc: 'Collecting live OHLCV + order book data...', detail: 'Binance, CoinGecko, Alpha Vantage' },
    { layer: 'L2: Technical Analysis', desc: 'Computing 30+ indicators simultaneously...', detail: 'RSI, MACD, ATR, BB, Ichimoku, ADX, OBV, VWAP' },
    { layer: 'L3: Market Regime Detection', desc: 'Classifying market state...', detail: 'Trending / Ranging / Volatile / Breakout' },
    { layer: 'L4: Signal Scoring Engine', desc: 'Multi-factor confidence scoring...', detail: 'Trend + Confirmation + Volume + Pattern + R:R' },
    { layer: 'L5: AI Explanation Engine', desc: 'LLM synthesizing analysis...', detail: 'GPT-4 Turbo multilingual synthesis' },
    { layer: 'L6: Alternative Opportunities', desc: 'Ranking cross-asset alternatives...', detail: 'Scanning all 40+ assets for better setups' },
  ];

  const handleGetSignal = async () => {
    if (remainingSignals === 0 && user?.plan !== 'unlimited') { setShowUpgradeModal(true); return; }
    setSignalState('loading');
    setLoadingStep(0);
    for (let i = 0; i < 6; i++) { setLoadingStep(i); await new Promise(r => setTimeout(r, 600)); }
    const success = useSignal();
    if (!success) { setSignalState('idle'); return; }
    await new Promise(r => setTimeout(r, 400));

    const hasSignal = Math.random() > 0.2;
    if (hasSignal) {
      const template = sampleSignals.find(s => s.assetId === selectedAssetId) || sampleSignals[Math.floor(Math.random() * sampleSignals.length)];
      const liveSignal = generateLiveSignal(selectedAsset, template, signalHold, currentChartPrice);
      setCurrentSignal(liveSignal);
      addSignalToHistory(liveSignal);
      setSignalState('result');
    } else {
      setSignalState('no_signal');
    }
  };

  const marketTabs: { key: Market; label: string; icon: string }[] = [
    { key: 'crypto', label: 'Crypto', icon: '₿' },
    { key: 'gold', label: 'Gold', icon: '🥇' },
    { key: 'oil', label: 'Oil & Energy', icon: '🛢️' },
    { key: 'silver', label: 'Silver', icon: '🥈' },
  ];

  const timeframes: Timeframe[] = ['1m', '5m', '10m', '15m', '30m', '1h', '4h', '1d'];
  const signalHolds: Timeframe[] = ['1m', '5m', '10m', '15m', '30m', '1h', '4h', '1d'];
  const marketCounts = { crypto: liveAssets.filter(a => a.market === 'crypto').length, gold: liveAssets.filter(a => a.market === 'gold').length, oil: liveAssets.filter(a => a.market === 'oil').length, silver: liveAssets.filter(a => a.market === 'silver').length };

  const formatPrice = (p: number) => p < 0.001 ? p.toExponential(4) : p < 10 ? p.toFixed(4) : p.toLocaleString(undefined, { maximumFractionDigits: 3 });

  return (
    <div className="space-y-0">
      {/* Market Tabs */}
      <div className="sticky top-0 z-30 bg-gray-950 border-b border-gray-800">
        <div className="flex items-center gap-1 p-2 overflow-x-auto">
          {marketTabs.map(tab => (
            <button key={tab.key} onClick={() => { setActiveMarket(tab.key); setSelectedAssetId(liveAssets.find(a => a.market === tab.key)?.id || 'btc'); setSignalState('idle'); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition flex-shrink-0 ${activeMarket === tab.key ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-400 hover:bg-gray-800'}`}>
              <span>{tab.icon}</span> {tab.label}
              <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded-full">{marketCounts[tab.key]}</span>
            </button>
          ))}
          <button onClick={() => setShowSearch(!showSearch)} className="ml-auto p-2 rounded-lg hover:bg-gray-800 transition flex-shrink-0">
            <Search className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        {showSearch && (
          <div className="px-3 pb-2">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search (BTC, XAU, WTI, XAG, ETH, GOLD, GAS...)" autoFocus
              className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:border-cyan-500 focus:outline-none" />
          </div>
        )}
      </div>

      {/* Asset Selector */}
      <div className="flex gap-2 p-3 overflow-x-auto">
        {filteredAssets.map(asset => (
          <button key={asset.id} onClick={() => { setSelectedAssetId(asset.id); setSignalState('idle'); navigate(`/markets/${asset.id}`, { replace: true }); }}
            className={`flex-shrink-0 px-3 py-2 rounded-xl border transition text-left min-w-[110px] ${selectedAssetId === asset.id ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'}`}>
            <p className="font-semibold text-xs">{asset.symbol}</p>
            <p className="text-[10px] text-gray-500 truncate">{asset.name}</p>
            <p className="text-[10px] font-mono">{formatPrice(asset.price)}</p>
            <p className={`text-[10px] font-medium ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%</p>
          </button>
        ))}
      </div>

      {/* Live Chart */}
      <div className="px-3">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold">{selectedAsset.symbol}</h3>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono font-bold">{formatPrice(currentChartPrice)}</span>
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${selectedAsset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedAsset.change24h >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(selectedAsset.change24h).toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={refreshPrices} className="p-1.5 rounded-lg hover:bg-gray-800 transition" title="Refresh prices">
                <RefreshCw className={`w-4 h-4 text-gray-400 ${isLiveLoading ? 'animate-spin' : ''}`} />
              </button>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-green-400 font-semibold">LIVE</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-800 text-[10px]">
                <Layers className="w-3 h-3 text-cyan-400" />
                <span className="text-cyan-400 font-semibold">6-Layer</span>
              </div>
            </div>
          </div>
          {lastPriceUpdate && <p className="text-[10px] text-gray-600 px-3 -mt-1 mb-1">Last update: {lastPriceUpdate.toLocaleTimeString()}</p>}
          <div className="flex gap-1 px-3 pb-2">
            {timeframes.map(tf => (
              <button key={tf} onClick={() => setTimeframe(tf)} className={`px-2 py-1 rounded-lg text-xs font-medium transition ${timeframe === tf ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:bg-gray-800'}`}>{tf}</button>
            ))}
          </div>
          <div className="h-[540px] bg-white">
            {chartLoading ? (
              <div className="h-full flex items-center justify-center"><div className="w-8 h-8 border-2 border-gray-700 border-t-cyan-400 rounded-full animate-spin" /></div>
            ) : (
              <CandlestickChart data={candleData} formatPrice={formatPrice} />
            )}
          </div>
          <div className="flex gap-2 p-3 border-t border-gray-800">
            {['RSI', 'MACD', 'MA', 'VOL', 'BB', 'ICH'].map(ind => (
              <span key={ind} className="text-[10px] font-semibold px-2 py-1 rounded-md bg-gray-800 text-gray-400 hover:text-cyan-400 cursor-pointer transition">{ind}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Signal Panel */}
      <div className="p-3 space-y-4">
        {signalState === 'idle' && (
          <div className="space-y-3">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-semibold text-gray-300">Signal Holding Time</p>
                  <p className="text-[10px] text-gray-500">Shorter holds use tighter entry, SL, and TP.</p>
                </div>
                <Clock className="w-4 h-4 text-purple-400" />
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {signalHolds.map(hold => (
                  <button
                    key={hold}
                    onClick={() => setSignalHold(hold)}
                    className={`rounded-lg px-2 py-2 text-xs font-semibold transition ${signalHold === hold ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}
                  >
                    {hold}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleGetSignal} className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5" /> Get {signalHold} AI Signal
            </button>
            <div className="flex items-center justify-center gap-4 text-[10px] text-gray-600">
              <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> 6-Layer Analysis</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> 30+ Indicators</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Hold Duration</span>
            </div>
          </div>
        )}

        {signalState === 'loading' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full border-4 border-gray-700 border-t-cyan-400 animate-spin" />
              <h3 className="font-bold">Analyzing {selectedAsset.symbol}...</h3>
              <p className="text-xs text-gray-400 mt-1">Running 6-Layer Hybrid Engine on live data</p>
            </div>
            <div className="space-y-2">
              {loadingSteps.map((step, i) => (
                <div key={i} className={`p-3 rounded-xl transition-all duration-300 ${i < loadingStep ? 'bg-green-500/10 border border-green-500/20' : i === loadingStep ? 'bg-cyan-500/10 border border-cyan-500/30 animate-pulse' : 'bg-gray-800/30 border border-gray-800'}`}>
                  <div className="flex items-center gap-2">
                    {i < loadingStep ? <span className="text-green-400 text-xs">✓</span> : i === loadingStep ? <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> : <span className="w-2 h-2 rounded-full bg-gray-600" />}
                    <div className="flex-1">
                      <p className={`text-xs font-semibold ${i <= loadingStep ? 'text-white' : 'text-gray-500'}`}>{step.layer}</p>
                      <p className={`text-[10px] ${i <= loadingStep ? 'text-gray-400' : 'text-gray-600'}`}>{i <= loadingStep ? step.desc : step.detail}</p>
                    </div>
                    {i < loadingStep && <span className="text-[10px] text-green-400">Done</span>}
                    {i === loadingStep && <span className="text-[10px] text-cyan-400">Processing</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {signalState === 'result' && currentSignal && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className={`p-4 ${currentSignal.action === 'buy' ? 'bg-green-500/10' : currentSignal.action === 'sell' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">{currentSignal.assetSymbol} · {currentSignal.timeframe} · 6-Layer Analysis</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-2xl font-bold ${currentSignal.action === 'buy' ? 'text-green-400' : currentSignal.action === 'sell' ? 'text-red-400' : 'text-amber-400'}`}>
                      {currentSignal.action.toUpperCase()}
                    </span>
                    {currentSignal.action === 'buy' ? <TrendingUp className="w-6 h-6 text-green-400" /> : <TrendingDown className="w-6 h-6 text-red-400" />}
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${currentSignal.marketStatus === 'favorable' ? 'bg-green-500/20 text-green-400' : currentSignal.marketStatus === 'neutral' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                  {currentSignal.marketStatus.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-gray-500 mb-0.5">Setup Confidence</p>
                  <p className="text-2xl font-bold text-cyan-400">{currentSignal.confidence}%</p>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1.5"><div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: `${currentSignal.confidence}%` }} /></div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-gray-500 mb-0.5">Historical Success</p>
                  <p className="text-2xl font-bold text-green-400">{currentSignal.similarSetupSuccess}%</p>
                  <p className="text-[9px] text-gray-600 mt-1.5">Similar setups</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-gray-500 mb-0.5">Risk Level</p>
                  <p className={`text-2xl font-bold ${currentSignal.risk === 'low' ? 'text-green-400' : currentSignal.risk === 'medium' ? 'text-amber-400' : 'text-red-400'}`}>
                    {currentSignal.risk.charAt(0).toUpperCase() + currentSignal.risk.slice(1)}
                  </p>
                </div>
              </div>

              {/* Hold Duration */}
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-xs text-gray-400">Suggested Hold Duration</p>
                    <p className="font-bold text-lg text-purple-400">{currentSignal.holdDuration}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-[10px] text-gray-500">Timeframe: {currentSignal.timeframe}</p>
                    <p className="text-[10px] text-gray-500">Expires: {new Date(currentSignal.expiresAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-xl p-3">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Layers className="w-3 h-3" /> Layers Used</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Market Data', '30+ Indicators', 'Regime', 'Scoring', 'AI', 'Alternatives'].map((layer, i) => (
                    <span key={i} className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">✓ {layer}</span>
                  ))}
                </div>
              </div>

              {currentSignal.action !== 'wait' && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Entry & Exit Zones</h4>
                  <div className="bg-gray-800/50 rounded-xl p-3 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Current Chart Price</span><span className="font-mono text-white">{formatPrice(currentChartPrice)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Entry Zone <span className="text-[10px] text-gray-600">(preferred range)</span></span><span className="font-mono">{formatPrice(currentSignal.entryZone[0])} - {formatPrice(currentSignal.entryZone[1])}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Stop Loss</span><span className="font-mono text-red-400">{formatPrice(currentSignal.stopLoss)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Take Profit 1</span><span className="font-mono text-green-400">{formatPrice(currentSignal.takeProfit1)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Take Profit 2</span><span className="font-mono text-green-400">{formatPrice(currentSignal.takeProfit2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Risk:Reward</span><span className="font-mono text-cyan-400">1:{((currentSignal.takeProfit1 - currentSignal.entryZone[0]) / (currentSignal.entryZone[0] - currentSignal.stopLoss)).toFixed(1)}</span></div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Explanation</h4>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <p className="text-sm text-gray-300 leading-relaxed">{currentSignal.explanation}</p>
                  {(user?.plan === 'pro' || user?.plan === 'unlimited' || user?.isAdmin) && currentSignal.advancedExplanation && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="flex items-center gap-1 mb-2"><Layers className="w-3 h-3 text-purple-400" /><span className="text-xs font-semibold text-purple-400">6-Layer Breakdown (Pro)</span></div>
                      <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">{currentSignal.advancedExplanation}</p>
                    </div>
                  )}
                  {(user?.plan !== 'pro' && user?.plan !== 'unlimited' && !user?.isAdmin) && (
                    <div className="mt-3 pt-3 border-t border-gray-700"><p className="text-xs text-gray-500">🔒 Upgrade to Pro for 6-Layer detailed breakdown</p></div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-800/50 rounded-xl p-3">
                <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-400">Setup Quality</span></div>
                <span className="font-bold text-sm">{currentSignal.setupQuality}/100</span>
              </div>

              {(user?.plan === 'pro' || user?.plan === 'unlimited' || user?.isAdmin) && currentSignal.action !== 'wait' && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1"><Info className="w-3 h-3" /> Block Allocation</h4>
                  <div className="bg-gray-800/50 rounded-xl p-3 grid grid-cols-3 gap-2 text-center">
                    <div><p className="text-[10px] text-gray-500">Conservative</p><p className="font-bold text-sm">2%</p></div>
                    <div><p className="text-[10px] text-gray-500">Moderate</p><p className="font-bold text-sm">5%</p></div>
                    <div><p className="text-[10px] text-gray-500">Aggressive</p><p className="font-bold text-sm">8%</p></div>
                  </div>
                </div>
              )}

              <button onClick={() => setSignalState('idle')} className="w-full py-3 rounded-xl bg-gray-800 text-gray-300 font-semibold text-sm hover:bg-gray-700 transition">Analyze Another Asset</button>
            </div>
          </div>
        )}

        {signalState === 'no_signal' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="bg-amber-500/10 p-4 text-center">
              <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h3 className="font-bold text-lg text-amber-400">No Strong Setup Right Now</h3>
              <p className="text-gray-400 text-sm mt-2">6-Layer Engine found no safe, high-confidence setup for {selectedAsset.symbol}. Wait or explore better opportunities.</p>
            </div>
            <div className="p-4 space-y-4">
              <h4 className="font-semibold text-sm">🔄 Better Opportunities</h4>
              <div className="space-y-2">
                {alternativeAssets.filter(a => a.assetId !== selectedAssetId).slice(0, 4).map(alt => {
                  const altAsset = liveAssets.find(a => a.id === alt.assetId);
                  return (
                    <button key={alt.assetId} onClick={() => { setSelectedAssetId(alt.assetId); setSignalState('idle'); navigate(`/markets/${alt.assetId}`, { replace: true }); }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-cyan-500/30 transition">
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-sm">{alt.symbol}</p>
                        <p className="text-xs text-gray-500">{alt.name} · {altAsset ? formatPrice(altAsset.price) : ''}</p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <span className={`text-xs font-bold ${alt.action === 'buy' ? 'text-green-400' : 'text-red-400'}`}>{alt.action.toUpperCase()}</span>
                        <span className="text-sm font-bold text-cyan-400">{alt.confidence}%</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setSignalState('idle')} className="w-full py-3 rounded-xl bg-gray-800 text-gray-300 font-semibold text-sm hover:bg-gray-700 transition">Try Another Asset</button>
            </div>
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-gray-400" /> Market Regime</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-800/50 rounded-xl p-3 text-center"><p className="text-[10px] text-gray-500 mb-1">Trend</p><p className="text-sm font-bold text-green-400">Bullish</p></div>
            <div className="bg-gray-800/50 rounded-xl p-3 text-center"><p className="text-[10px] text-gray-500 mb-1">Volatility</p><p className="text-sm font-bold text-amber-400">Medium</p></div>
            <div className="bg-gray-800/50 rounded-xl p-3 text-center"><p className="text-[10px] text-gray-500 mb-1">Volume</p><p className="text-sm font-bold text-cyan-400">Above Avg</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CandlestickChart({ data, formatPrice }: { data: CandleData[]; formatPrice: (price: number) => string }) {
  const width = 760;
  const height = 540;
  const rightAxis = 118;
  const chartWidth = width - rightAxis;
  const chartHeight = 415;
  const volumeTop = 428;
  const volumeHeight = 96;
  const paddingTop = 16;
  const values = data.flatMap(candle => [candle.high, candle.low]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 0.000001);
  const maxVolume = Math.max(...data.map(candle => candle.volume), 1);
  const current = data[data.length - 1]?.close || 0;
  const yFor = (price: number) => paddingTop + ((max - price) / range) * (chartHeight - paddingTop - 12);
  const xStep = chartWidth / data.length;
  const candleWidth = Math.max(3, Math.min(9, xStep * 0.62));
  const currentY = yFor(current);
  const axisTicks = Array.from({ length: 10 }, (_, i) => max - (range / 9) * i);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full bg-white" preserveAspectRatio="none">
      <rect x="0" y="0" width={width} height={height} fill="#ffffff" />
      {axisTicks.map((tick, index) => {
        const y = yFor(tick);
        return (
          <g key={index}>
            <line x1="0" y1={y} x2={chartWidth} y2={y} stroke="#ececec" strokeWidth="1" />
            <text x={chartWidth + 14} y={y + 5} fill="#111827" fontSize="15" fontWeight={index % 2 === 0 ? 700 : 400}>
              {formatPrice(tick)}
            </text>
          </g>
        );
      })}
      {Array.from({ length: 8 }, (_, index) => (
        <line key={index} x1={(chartWidth / 7) * index} y1="0" x2={(chartWidth / 7) * index} y2={height} stroke="#f0f0f0" strokeWidth="1" />
      ))}
      {data.map((candle, index) => {
        const x = index * xStep + xStep / 2;
        const up = candle.close >= candle.open;
        const color = up ? '#089981' : '#f23645';
        const bodyTop = yFor(Math.max(candle.open, candle.close));
        const bodyBottom = yFor(Math.min(candle.open, candle.close));
        const bodyHeight = Math.max(2, bodyBottom - bodyTop);
        const volumeHeightPx = (candle.volume / maxVolume) * volumeHeight;

        return (
          <g key={`${candle.time}-${index}`}>
            <line x1={x} y1={yFor(candle.high)} x2={x} y2={yFor(candle.low)} stroke={color} strokeWidth="1.4" />
            <rect x={x - candleWidth / 2} y={bodyTop} width={candleWidth} height={bodyHeight} fill={color} />
            <rect x={x - candleWidth / 2} y={volumeTop + (volumeHeight - volumeHeightPx)} width={candleWidth} height={volumeHeightPx} fill={up ? '#7fcac3' : '#f6a2a8'} opacity="0.88" />
          </g>
        );
      })}
      <line x1="0" y1={currentY} x2={chartWidth} y2={currentY} stroke="#f23645" strokeWidth="1" strokeDasharray="2 5" />
      <rect x={chartWidth + 4} y={currentY - 19} width="106" height="38" rx="2" fill="#f23645" />
      <text x={chartWidth + 13} y={currentY - 2} fill="white" fontSize="17" fontWeight="600">{formatPrice(current)}</text>
      <text x={chartWidth + 13} y={currentY + 14} fill="white" fontSize="13">00:14</text>
      <rect x={chartWidth + 4} y={volumeTop + volumeHeight - 24} width="78" height="22" rx="2" fill="#f23645" />
      <text x={chartWidth + 18} y={volumeTop + volumeHeight - 8} fill="white" fontSize="16">110</text>
    </svg>
  );
}

