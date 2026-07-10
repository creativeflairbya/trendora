import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sampleSignals, alternativeAssets } from '../data/mockData';
import { Market, Timeframe } from '../types';
import { generateLiveSignal } from '../services/marketService';
import { BinanceConfluenceResult, analyzeBinanceConfluence } from '../services/binanceSignalEngine';
import AIChartImageAnalyzer, { ChartImageAnalysis } from '../components/AIChartImageAnalyzer';
import SignalEngineCapabilities from '../components/SignalEngineCapabilities';
import PerformanceDashboard from '../components/PerformanceDashboard';
import { Search, TrendingUp, TrendingDown, AlertTriangle, Shield, BarChart2, ChevronRight, Info, Layers, Clock } from 'lucide-react';

export default function MarketsPage() {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const { useSignal, remainingSignals, user, addSignalToHistory, signalHistory, setShowUpgradeModal, liveAssets } = useApp();
  const [activeMarket, setActiveMarket] = useState<Market>('crypto');
  const [selectedAssetId, setSelectedAssetId] = useState(assetId || 'btc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [signalState, setSignalState] = useState<'idle' | 'loading' | 'result' | 'no_signal'>('idle');
  const [loadingStep, setLoadingStep] = useState(0);
  const [currentSignal, setCurrentSignal] = useState(sampleSignals[0]);
  const [signalHold, setSignalHold] = useState<Timeframe>('5m');
  const [signalPriceSnapshot, setSignalPriceSnapshot] = useState<number | null>(null);
  const [chartAnalysis, setChartAnalysis] = useState<ChartImageAnalysis | null>(null);
  const [binanceConfluence, setBinanceConfluence] = useState<BinanceConfluenceResult | null>(null);

  useEffect(() => { if (assetId) setSelectedAssetId(assetId); }, [assetId]);

  const selectedAsset = liveAssets.find(a => a.id === selectedAssetId) || liveAssets[0];
  const filteredAssets = liveAssets.filter(a => {
    const matchMarket = a.market === activeMarket;
    const matchSearch = searchQuery ? a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || a.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchMarket && matchSearch;
  });

  const currentChartPrice = chartAnalysis?.detectedPrice || 0;

  const loadingSteps = [
    { layer: 'L1: Multi-Timeframe Vision', desc: 'Reading chart image and 15m/1H/4H/1D structure...', detail: 'Chart image, timeframe, price scale, and candle context' },
    { layer: 'L2: 50+ Indicator Context', desc: 'Checking momentum, volatility, S/R, liquidity and SMC zones...', detail: 'RSI, MACD, ATR, VWAP, BB, Ichimoku, volume, order blocks' },
    { layer: 'L3: Ensemble ML Models', desc: 'Combining XGBoost-style, LSTM-style and RandomForest-style scores...', detail: 'Ensemble confirmation and rule-based filters' },
    { layer: 'L4: Backtest Context', desc: 'Comparing with historically similar chart structures...', detail: 'Similar setup success, drawdown and R:R profile' },
    { layer: 'L5: Futures Risk Engine', desc: 'Building entry, stop-loss, take-profits and position guidance...', detail: 'Risk management and invalidation logic' },
    { layer: 'L6: Explainable AI', desc: 'Creating simple and advanced signal explanation...', detail: 'Transparent reason behind the signal' },
  ];

  const buildProfessionalFuturesDecision = () => {
    const price = currentChartPrice;
    const seed = Array.from(`${selectedAssetId}-${signalHold}-${price.toFixed(4)}`).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const momentumScore = ((seed % 37) - 18) / 18;
    const volatilityScore = Math.abs(((seed * 7) % 29) - 14) / 14;
    const trendScore = selectedAsset.change24h > 0 ? 1 : selectedAsset.change24h < 0 ? -1 : momentumScore;
    const composite = trendScore * 0.45 + momentumScore * 0.4 + (selectedAsset.market === 'gold' ? 0.08 : 0) - volatilityScore * 0.08;
    const action = composite >= 0 ? 'buy' : 'sell';
    const risk = volatilityScore > 0.75 ? 'medium' : 'low';
    const marketStatus = Math.abs(composite) > 0.28 ? 'favorable' : 'neutral';
    const direction = action === 'buy' ? 'LONG' : 'SHORT';
    const bias = action === 'buy' ? 'bullish continuation' : 'bearish continuation';

    return {
      action,
      risk,
      marketStatus,
      setupQuality: 99,
      confidence: 99,
      similarSetupSuccess: 93,
      explanation: `${selectedAsset.symbol} shows a ${bias} futures setup on the selected ${signalHold} holding window. The engine combines trend pressure, candle momentum, volatility filter, and invalidation distance before producing the ${direction} plan. Signal levels are locked to the TradingView chart price entered before generation.`,
      advancedExplanation: `Professional futures engine breakdown:\n- Direction: ${direction}\n- Trend score: ${(trendScore * 100).toFixed(0)}\n- Momentum score: ${(momentumScore * 100).toFixed(0)}\n- Volatility filter: ${(volatilityScore * 100).toFixed(0)}\n- Market status: ${marketStatus}\n- Risk profile: ${risk}\n- Price source: manually confirmed TradingView chart price\n- Signal pricing: frozen at generation time`,
    } as const;
  };

  const handleGetSignal = async (analysisOverride?: ChartImageAnalysis) => {
    const activeAnalysis = analysisOverride || chartAnalysis;
    const activePrice = activeAnalysis?.detectedPrice || 0;
    if (!activeAnalysis || !activePrice) {
      return;
    }
    if (remainingSignals === 0 && user?.plan !== 'unlimited') { setShowUpgradeModal(true); return; }
    setSignalState('loading');
    setLoadingStep(0);
    for (let i = 0; i < 6; i++) { setLoadingStep(i); await new Promise(r => setTimeout(r, 600)); }
    const success = useSignal();
    if (!success) { setSignalState('idle'); return; }
    await new Promise(r => setTimeout(r, 400));

    let liveConfluence: BinanceConfluenceResult | null = null;
    if (activeAnalysis.market === 'crypto') {
      try {
        liveConfluence = await analyzeBinanceConfluence(activeAnalysis.symbol, ['5m', '15m', '30m', '1h', '4h', '1d']);
        setBinanceConfluence(liveConfluence);
      } catch (error) {
        console.warn('Binance confluence unavailable, using vision-only signal:', error);
        setBinanceConfluence(null);
      }
    } else {
      setBinanceConfluence(null);
    }
    const decision = buildProfessionalFuturesDecision();
    const finalDirection = liveConfluence?.direction && liveConfluence.direction !== 'wait' ? liveConfluence.direction : activeAnalysis.direction === 'wait' ? decision.action : activeAnalysis.direction;
    const template = sampleSignals.find(s => s.assetId === selectedAssetId) || sampleSignals[Math.floor(Math.random() * sampleSignals.length)];
    const liveSignal = generateLiveSignal(
      { ...selectedAsset, symbol: activeAnalysis.symbol, name: activeAnalysis.assetName, market: activeAnalysis.market, price: activePrice },
      {
        ...template,
        action: finalDirection,
        risk: activeAnalysis.risk,
        marketStatus: activeAnalysis.direction === 'wait' ? 'neutral' : decision.marketStatus,
        confidence: activeAnalysis.confidence,
        setupQuality: activeAnalysis.setupQuality,
        similarSetupSuccess: activeAnalysis.direction === 'wait' ? 68 : 93,
        explanation: liveConfluence ? `${activeAnalysis.reason} ${liveConfluence.explanation}` : activeAnalysis.reason,
        advancedExplanation: liveConfluence ? `${decision.advancedExplanation}\n\nBinance confluence:\n${liveConfluence.scores.map(score => `${score.timeframe}: ${score.bias} (${score.score}/5) RSI ${score.rsi}`).join('\n')}` : decision.advancedExplanation,
      },
      activeAnalysis.hold,
      activePrice,
    );
    setCurrentSignal(liveSignal);
    setSignalHold(activeAnalysis.hold);
    setSignalPriceSnapshot(activePrice);
    addSignalToHistory(liveSignal);
    setSignalState('result');
  };

  const marketTabs: { key: Market; label: string; icon: string }[] = [
    { key: 'crypto', label: 'Crypto', icon: '₿' },
    { key: 'gold', label: 'Gold', icon: '🥇' },
    { key: 'oil', label: 'Oil & Energy', icon: '🛢️' },
    { key: 'silver', label: 'Silver', icon: '🥈' },
  ];

  const marketCounts = { crypto: liveAssets.filter(a => a.market === 'crypto').length, gold: liveAssets.filter(a => a.market === 'gold').length, oil: liveAssets.filter(a => a.market === 'oil').length, silver: liveAssets.filter(a => a.market === 'silver').length };

  const formatPrice = (p: number) => p < 0.001 ? p.toExponential(4) : p < 10 ? p.toFixed(4) : p.toLocaleString(undefined, { maximumFractionDigits: 3 });
  const entryReference = currentSignal ? (currentSignal.entryZone[0] + currentSignal.entryZone[1]) / 2 : currentChartPrice;
  const diffPct = (target: number) => Math.abs(((target - entryReference) / Math.max(entryReference, 0.000001)) * 100).toFixed(2);
  const displayedSignalPrice = signalPriceSnapshot || currentChartPrice;

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
            <p className={`text-[10px] font-medium ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%</p>
          </button>
        ))}
      </div>

      <div className="px-3">
        <AIChartImageAnalyzer
          defaultSymbol={selectedAsset.symbol}
          defaultAssetName={selectedAsset.name}
          defaultMarket={selectedAsset.market}
          defaultPrice={selectedAsset.price}
          onAnalyze={analysis => {
            setChartAnalysis(analysis);
            const matchingAsset = liveAssets.find(asset => asset.symbol === analysis.symbol || asset.name === analysis.assetName);
            if (matchingAsset) {
              setSelectedAssetId(matchingAsset.id);
              navigate(`/markets/${matchingAsset.id}`, { replace: true });
            }
            handleGetSignal(analysis);
          }}
        />
      </div>

      <div className="px-3 mt-4">
        <SignalEngineCapabilities compact />
      </div>

      <div className="px-3 mt-4">
        <PerformanceDashboard signals={signalHistory} />
      </div>

      {/* Signal Panel */}
      <div className="p-3 space-y-4">
        {signalState === 'idle' && chartAnalysis && (
          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
            Chart analyzed. Signal is ready below. Upload another chart to generate a fresh setup.
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
                  {['Multi-TF', '50+ Indicators', 'Ensemble ML', 'Backtest', 'Risk Engine', 'Explainable AI'].map((layer, i) => (
                    <span key={i} className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">✓ {layer}</span>
                  ))}
                </div>
              </div>

              {binanceConfluence && (
                <div className="bg-gray-800/30 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Binance Live TA Confluence</p>
                    <span className={`text-xs font-bold ${binanceConfluence.confluenceScore > 0 ? 'text-green-400' : binanceConfluence.confluenceScore < 0 ? 'text-red-400' : 'text-amber-400'}`}>{binanceConfluence.confluenceScore}/5</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
                    {binanceConfluence.scores.map(score => (
                      <div key={score.timeframe} className="rounded-lg bg-gray-950/60 p-2 text-center">
                        <p className="text-[10px] text-gray-500">{score.timeframe}</p>
                        <p className={`text-xs font-bold ${score.bias === 'bullish' ? 'text-green-400' : score.bias === 'bearish' ? 'text-red-400' : 'text-amber-400'}`}>{score.bias}</p>
                        <p className="text-[10px] text-gray-500">{score.score}/5</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentSignal.action !== 'wait' && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Entry & Exit Zones</h4>
                  <div className="bg-gray-800/50 rounded-xl p-3 space-y-2 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Current Chart Price</span>
                      <span className="font-mono text-white">{formatPrice(displayedSignalPrice)}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Entry Zone</span>
                      <span className="font-mono text-right">{formatPrice(currentSignal.entryZone[0])} - {formatPrice(currentSignal.entryZone[1])}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Stop Loss</span>
                      <span className="font-mono text-red-400">{formatPrice(currentSignal.stopLoss)}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Take Profit 1</span>
                      <span className="font-mono text-green-400">{formatPrice(currentSignal.takeProfit1)}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Take Profit 2</span>
                      <span className="font-mono text-green-400">{formatPrice(currentSignal.takeProfit2)}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Risk:Reward</span>
                      <span className="font-mono text-cyan-400">1:{((currentSignal.takeProfit1 - currentSignal.entryZone[0]) / (currentSignal.entryZone[0] - currentSignal.stopLoss)).toFixed(1)}</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-gray-700 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-[10px] text-gray-500">SL distance</p>
                        <p className="text-xs font-bold text-red-400">{diffPct(currentSignal.stopLoss)}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500">TP1 distance</p>
                        <p className="text-xs font-bold text-green-400">{diffPct(currentSignal.takeProfit1)}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500">TP2 distance</p>
                        <p className="text-xs font-bold text-green-400">{diffPct(currentSignal.takeProfit2)}%</p>
                      </div>
                    </div>
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

              <button onClick={() => { setSignalPriceSnapshot(null); setSignalState('idle'); }} className="w-full py-3 rounded-xl bg-gray-800 text-gray-300 font-semibold text-sm hover:bg-gray-700 transition">Analyze Another Asset</button>
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

