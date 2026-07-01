import { Asset, Signal, Plan, AlternativeAsset, FAQ, AdminStats, Notification } from '../types';

function generateChartData(base: number, points: number = 60): { time: string; price: number }[] {
  const data: { time: string; price: number }[] = [];
  let price = base;
  for (let i = 0; i < points; i++) {
    price += (Math.random() - 0.48) * base * 0.008;
    const hour = Math.floor(i * 4 / 60);
    const min = (i * 4) % 60;
    data.push({ time: `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`, price: parseFloat(price.toFixed(base < 1 ? 6 : base < 100 ? 4 : 2)) });
  }
  return data;
}

export const assets: Asset[] = [
  // === CRYPTO MAJOR ===
  { id: 'btc', symbol: 'BTC/USDT', name: 'Bitcoin', market: 'crypto', price: 67432.18, change24h: 2.34, chartData: generateChartData(67432) },
  { id: 'eth', symbol: 'ETH/USDT', name: 'Ethereum', market: 'crypto', price: 3521.45, change24h: -1.12, chartData: generateChartData(3521) },
  { id: 'bnb', symbol: 'BNB/USDT', name: 'BNB', market: 'crypto', price: 612.33, change24h: 0.89, chartData: generateChartData(612) },
  { id: 'sol', symbol: 'SOL/USDT', name: 'Solana', market: 'crypto', price: 178.92, change24h: 5.67, chartData: generateChartData(178) },
  { id: 'xrp', symbol: 'XRP/USDT', name: 'Ripple', market: 'crypto', price: 0.6234, change24h: -2.45, chartData: generateChartData(0.62) },
  { id: 'ada', symbol: 'ADA/USDT', name: 'Cardano', market: 'crypto', price: 0.4521, change24h: 1.23, chartData: generateChartData(0.45) },
  { id: 'avax', symbol: 'AVAX/USDT', name: 'Avalanche', market: 'crypto', price: 38.67, change24h: -0.56, chartData: generateChartData(38) },
  { id: 'doge', symbol: 'DOGE/USDT', name: 'Dogecoin', market: 'crypto', price: 0.1245, change24h: 8.91, chartData: generateChartData(0.12) },
  { id: 'dot', symbol: 'DOT/USDT', name: 'Polkadot', market: 'crypto', price: 7.34, change24h: 2.11, chartData: generateChartData(7.34) },
  { id: 'link', symbol: 'LINK/USDT', name: 'Chainlink', market: 'crypto', price: 14.56, change24h: 3.45, chartData: generateChartData(14.56) },
  { id: 'matic', symbol: 'MATIC/USDT', name: 'Polygon', market: 'crypto', price: 0.7234, change24h: -1.78, chartData: generateChartData(0.72) },
  { id: 'atom', symbol: 'ATOM/USDT', name: 'Cosmos', market: 'crypto', price: 9.12, change24h: 1.56, chartData: generateChartData(9.12) },
  { id: 'uni', symbol: 'UNI/USDT', name: 'Uniswap', market: 'crypto', price: 7.89, change24h: -0.34, chartData: generateChartData(7.89) },
  { id: 'ltc', symbol: 'LTC/USDT', name: 'Litecoin', market: 'crypto', price: 84.23, change24h: 1.89, chartData: generateChartData(84) },
  { id: 'near', symbol: 'NEAR/USDT', name: 'NEAR Protocol', market: 'crypto', price: 5.67, change24h: 4.23, chartData: generateChartData(5.67) },
  { id: 'apt', symbol: 'APT/USDT', name: 'Aptos', market: 'crypto', price: 8.92, change24h: -2.11, chartData: generateChartData(8.92) },
  { id: 'arb', symbol: 'ARB/USDT', name: 'Arbitrum', market: 'crypto', price: 1.12, change24h: 0.78, chartData: generateChartData(1.12) },
  { id: 'op', symbol: 'OP/USDT', name: 'Optimism', market: 'crypto', price: 2.34, change24h: 3.56, chartData: generateChartData(2.34) },
  { id: 'fil', symbol: 'FIL/USDT', name: 'Filecoin', market: 'crypto', price: 5.78, change24h: -0.89, chartData: generateChartData(5.78) },
  { id: 'render', symbol: 'RNDR/USDT', name: 'Render', market: 'crypto', price: 7.45, change24h: 6.78, chartData: generateChartData(7.45) },
  { id: 'pepe', symbol: 'PEPE/USDT', name: 'Pepe', market: 'crypto', price: 0.00001234, change24h: 12.34, chartData: generateChartData(0.00001234) },
  { id: 'shib', symbol: 'SHIB/USDT', name: 'Shiba Inu', market: 'crypto', price: 0.00002567, change24h: 4.56, chartData: generateChartData(0.00002567) },
  { id: 'inu', symbol: 'FLOKI/USDT', name: 'Floki Inu', market: 'crypto', price: 0.000178, change24h: -3.21, chartData: generateChartData(0.000178) },
  { id: 'sui', symbol: 'SUI/USDT', name: 'Sui', market: 'crypto', price: 1.78, change24h: 7.89, chartData: generateChartData(1.78) },
  { id: 'sei', symbol: 'SEI/USDT', name: 'Sei', market: 'crypto', price: 0.45, change24h: 2.34, chartData: generateChartData(0.45) },
  { id: 'ton', symbol: 'TON/USDT', name: 'Toncoin', market: 'crypto', price: 6.89, change24h: 1.23, chartData: generateChartData(6.89) },
  { id: 'ftm', symbol: 'FTM/USDT', name: 'Fantom', market: 'crypto', price: 0.78, change24h: -1.56, chartData: generateChartData(0.78) },
  { id: 'egld', symbol: 'EGLD/USDT', name: 'MultiversX', market: 'crypto', price: 34.56, change24h: 2.67, chartData: generateChartData(34.56) },
  // === CRYPTO GAS TOKENS ===
  { id: 'gas', symbol: 'GAS/USDT', name: 'Neo GAS', market: 'crypto', price: 5.23, change24h: 3.45, chartData: generateChartData(5.23) },
  { id: 'ethgas', symbol: 'ETH/GAS', name: 'Ethereum Gas Tracker', market: 'crypto', price: 24.5, change24h: -5.67, chartData: generateChartData(24.5) },
  { id: 'maticgas', symbol: 'POL/Gas', name: 'Polygon Gas', market: 'crypto', price: 0.0234, change24h: 1.23, chartData: generateChartData(0.0234) },
  // === GOLD ===
  { id: 'xauusd', symbol: 'XAU/USD', name: 'Gold Spot', market: 'gold', price: 2345.60, change24h: 0.45, chartData: generateChartData(2345) },
  { id: 'xaueur', symbol: 'XAU/EUR', name: 'Gold Euro', market: 'gold', price: 2156.34, change24h: 0.32, chartData: generateChartData(2156) },
  { id: 'xaugbp', symbol: 'XAU/GBP', name: 'Gold Pound', market: 'gold', price: 1845.12, change24h: 0.56, chartData: generateChartData(1845) },
  { id: 'gold_futures', symbol: 'GC=F', name: 'Gold Futures', market: 'gold', price: 2352.80, change24h: 0.51, chartData: generateChartData(2352) },
  // === SILVER ===
  { id: 'xagusd', symbol: 'XAG/USD', name: 'Silver Spot', market: 'silver', price: 28.45, change24h: 1.67, chartData: generateChartData(28.45) },
  { id: 'xageur', symbol: 'XAG/EUR', name: 'Silver Euro', market: 'silver', price: 26.18, change24h: 1.34, chartData: generateChartData(26.18) },
  { id: 'silver_futures', symbol: 'SI=F', name: 'Silver Futures', market: 'silver', price: 28.62, change24h: 1.72, chartData: generateChartData(28.62) },
  // === OIL & ENERGY ===
  { id: 'wti', symbol: 'WTI/USD', name: 'Crude Oil WTI', market: 'oil', price: 78.34, change24h: -1.23, chartData: generateChartData(78.34) },
  { id: 'brent', symbol: 'BRENT/USD', name: 'Brent Crude', market: 'oil', price: 82.56, change24h: -0.89, chartData: generateChartData(82.56) },
  { id: 'natgas', symbol: 'NG/USD', name: 'Natural Gas', market: 'oil', price: 2.34, change24h: 3.21, chartData: generateChartData(2.34) },
  { id: 'heating_oil', symbol: 'HO=F', name: 'Heating Oil', market: 'oil', price: 2.45, change24h: 1.12, chartData: generateChartData(2.45) },
  { id: 'rbob', symbol: 'RB=F', name: 'RBOB Gasoline', market: 'oil', price: 2.28, change24h: -0.67, chartData: generateChartData(2.28) },
  { id: 'uso', symbol: 'USO', name: 'United States Oil Fund', market: 'oil', price: 72.34, change24h: -0.94, chartData: generateChartData(72.34) },
];

// === EXPERT SIGNAL ENGINE — 6-LAYER HYBRID SYSTEM ===
// This simulates the output of the hybrid signal engine.
// Production should replace these templates with backend-generated signals from live candles.
//
// LAYER 1: Market Data Engine (live + historical OHLCV)
// LAYER 2: Technical Analysis Engine (30+ indicators computed simultaneously)
// LAYER 3: Market Regime Engine (trending/ranging/volatile/news-sensitive)
// LAYER 4: Signal Scoring Engine (multi-factor weighted confidence)
// LAYER 5: AI Explanation Engine (LLM-powered multilingual summaries)
// LAYER 6: Alternative Opportunity Engine (cross-asset ranking)

export const sampleSignals: Signal[] = [
  {
    id: 'sig_btc_1', assetId: 'btc', assetSymbol: 'BTC/USDT', assetName: 'Bitcoin', market: 'crypto',
    action: 'buy', confidence: 94, risk: 'low', marketStatus: 'favorable',
    entryZone: [67200, 67600], stopLoss: 66500, takeProfit1: 68500, takeProfit2: 69800,
    setupQuality: 91, timeframe: '4h',
    explanation: 'BTC shows extremely strong bullish setup confirmed across 6 analysis layers. RSI at 62 with rising momentum, MACD histogram expanding positive, price bouncing off 20 EMA with above-average volume. Market regime: Trending Bullish. Wyckoff Phase D markup confirmed. Smart money accumulation detected via order flow. Risk-reward ratio is excellent at 1:3.2.',
    advancedExplanation: 'LAYER 1: Volume profile shows strong support at $67,200 (high volume node) with POC at $67,800. LAYER 2: 30-indicator composite score: 87/100. RSI(14)=62.3 rising, MACD(12,26,9) histogram +45 expanding, ADX=34.2 trending, Bollinger Band squeeze breakout confirmed, ATR(14)=$890 indicating normal volatility. Stochastic RSI crossing up from oversold. Ichimoku cloud: price above Senkou Span A with Tenkan/Kijun bullish cross. LAYER 3: Market regime = TRENDING BULLISH (87% confidence). ADX>25, higher highs since 3 sessions, volume expanding on up-bars. LAYER 4: Composite signal score 94/100. Trend alignment: 96%. Confirmation quality: 92%. Volume confirmation: 88%. Pattern reliability: 91%. Reward/Risk: 3.2:1. LAYER 5: AI synthesis — This is a high-conviction long setup with multi-indicator confluence. LAYER 6: Top alternative opportunities if BTC entry missed: SOL (89% confidence buy), ETH (83% confidence buy).',
    similarSetupSuccess: 79, holdDuration: '4-24 hours', createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86400000).toISOString()
  },
  {
    id: 'sig_xau_1', assetId: 'xauusd', assetSymbol: 'XAU/USD', assetName: 'Gold Spot', market: 'gold',
    action: 'buy', confidence: 91, risk: 'low', marketStatus: 'favorable',
    entryZone: [2340, 2350], stopLoss: 2320, takeProfit1: 2380, takeProfit2: 2420,
    setupQuality: 88, timeframe: '1d',
    explanation: 'Gold in strong structural uptrend with multi-layer confirmation. DXY weakening (down 0.4% today), real yields declining, central bank buying continues. Price holding above 50 DMA with RSI at 58 — room for further upside. Geopolitical risk premium supporting safe-haven demand. Fibonacci 0.618 retracement held perfectly at $2,340.',
    advancedExplanation: 'LAYER 1: Daily OHLCV shows 5 consecutive higher closes. Volume on up-days 42% above 20-day average. LAYER 2: RSI(14)=58.2 (neutral-bullish), MACD positive crossover 3 days ago, ADX=28.4 trending, 50 DMA ($2,328) providing support, 200 DMA ($2,215) well below — golden cross in effect. Bollinger Bands: price at upper band with room. Commodity Channel Index (CCI)=+82 approaching overbought but not extreme. LAYER 3: Market regime = TRENDING with SAFE-HAVEN BOOST. DXY correlation: -0.82 (strong inverse). LAYER 4: Score 91/100. Macro alignment: 95%. Technical confluence: 88%. Safe-haven demand: 93%. LAYER 5: This is a high-quality long with macro tailwinds and technical confirmation. LAYER 6: Silver (XAG/USD) also bullish at 84% confidence.',
    similarSetupSuccess: 76, holdDuration: '1-7 days', createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 172800000).toISOString()
  },
  {
    id: 'sig_sol_1', assetId: 'sol', assetSymbol: 'SOL/USDT', assetName: 'Solana', market: 'crypto',
    action: 'buy', confidence: 88, risk: 'medium', marketStatus: 'favorable',
    entryZone: [176, 180], stopLoss: 170, takeProfit1: 192, takeProfit2: 205,
    setupQuality: 84, timeframe: '4h',
    explanation: 'SOL breaking out of bull flag pattern on 4H chart with volume confirmation. RSI reset from overbought zone to 55 — fresh momentum available. Network activity surge (DEX volume +34% this week) supporting fundamental case. DeFi TVL increasing. Risk slightly higher due to crypto volatility but setup quality is strong.',
    advancedExplanation: 'LAYER 1: 4H chart shows textbook bull flag: pole from $155 to $185, flag consolidation $176-182. Volume declining during flag (correct). Breakout volume needed. LAYER 2: RSI(14)=55.4 (fresh, not overbought), MACD about to cross bullish, ADX=24 transitioning from range to trend. OBV rising. VWAP at $178 — price at VWAP. LAYER 3: Regime = BREAKOUT PENDING. LAYER 4: Score 88/100. Pattern quality: 92%. Volume setup: 85%. Momentum alignment: 87%. LAYER 5: Strong breakout setup with favorable risk-reward. Entry on flag breakout confirmation. LAYER 6: Alternative: NEAR (82% confidence buy).',
    similarSetupSuccess: 72, holdDuration: '4-24 hours', createdAt: new Date(Date.now() - 3600000).toISOString(), expiresAt: new Date(Date.now() + 43200000).toISOString()
  },
  {
    id: 'sig_xag_1', assetId: 'xagusd', assetSymbol: 'XAG/USD', assetName: 'Silver Spot', market: 'silver',
    action: 'buy', confidence: 86, risk: 'medium', marketStatus: 'favorable',
    entryZone: [28.10, 28.50], stopLoss: 27.40, takeProfit1: 29.80, takeProfit2: 31.20,
    setupQuality: 82, timeframe: '1d',
    explanation: 'Silver breaking above key resistance at $28.40 with industrial demand rising (solar panel manufacturing +18% YoY). Gold/sold ratio improving for silver. RSI at 62 with room to run. Inverse head-and-shoulders pattern completed on daily chart.',
    advancedExplanation: 'LAYER 1: Inverse H&S pattern: left shoulder $26.80, head $25.90, right shoulder $27.10, neckline $28.40. Measured move target: $31.20. LAYER 2: RSI(14)=62.1, MACD bullish crossover 5 days ago with expanding histogram, ADX=31.2 trending strongly. 50 DMA crossing above 200 DMA (golden cross imminent). LAYER 3: Regime = TRENDING with INDUSTRIAL DEMAND BOOST. LAYER 4: Score 86/100. Pattern quality: 90%. Industrial fundamentals: 88%. Gold correlation: 82%. LAYER 5: High-conviction silver long with pattern and fundamental alignment.',
    similarSetupSuccess: 71, holdDuration: '1-7 days', createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 172800000).toISOString()
  },
  {
    id: 'sig_eth_1', assetId: 'eth', assetSymbol: 'ETH/USDT', assetName: 'Ethereum', market: 'crypto',
    action: 'buy', confidence: 89, risk: 'low', marketStatus: 'favorable',
    entryZone: [3480, 3540], stopLoss: 3420, takeProfit1: 3620, takeProfit2: 3740,
    setupQuality: 87, timeframe: '1d',
    explanation: 'ETH holding critical support at $3,480 (38.2% Fibonacci retracement from $4,095 high). Rising wedge pattern forming with ascending support line. L2 activity surging (Arbitrum + Optimism TVL growing). Staking yield attracting institutional flows. ETH/BTC ratio stabilizing — potential rotation back to ETH.',
    advancedExplanation: 'LAYER 1: Daily chart shows higher lows since June support at $3,480. Volume on support tests: above average buying. LAYER 2: RSI(14)=55.8, MACD histogram turning positive, ADX=26 transitioning to trend. 200 DMA at $3,250 providing structural support. Fibonacci 38.2% retracement held perfectly. LAYER 3: Regime = ACCUMULATION → MARKUP transition. LAYER 4: Score 89/100. Support quality: 94%. L2 fundamental boost: 88%. Institutional flow: 85%. LAYER 5: Strong risk-reward long at key support with fundamental catalysts. LAYER 6: Alternative: ARB (78% confidence buy).',
    similarSetupSuccess: 74, holdDuration: '1-7 days', createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86400000).toISOString()
  },
  {
    id: 'sig_oil_1', assetId: 'wti', assetSymbol: 'WTI/USD', assetName: 'Crude Oil WTI', market: 'oil',
    action: 'sell', confidence: 82, risk: 'medium', marketStatus: 'neutral',
    entryZone: [79, 80], stopLoss: 82, takeProfit1: 75, takeProfit2: 72,
    setupQuality: 78, timeframe: '4h',
    explanation: 'WTI rejecting from $80 resistance zone (previous support now resistance). OPEC+ compliance concerns rising — members overproducing. US crude inventories unexpectedly +3.2M barrels. RSI overbought at 72 with bearish divergence. Potential head-and-shoulders forming on 4H chart.',
    advancedExplanation: 'LAYER 1: 4H chart shows potential H&S: left shoulder $81.20, head $82.40, right shoulder forming at $80.50. Neckline at $78. LAYER 2: RSI(14)=72.3 with price making higher highs but RSI making lower highs = bearish divergence. MACD histogram contracting. ADX=22 weakening trend. LAYER 3: Regime = RANGING with BEARISH BIAS. LAYER 4: Score 82/100. Pattern development: 78%. Divergence quality: 85%. Fundamental catalyst: 82%. LAYER 5: Counter-trend short opportunity with defined risk above $82. LAYER 6: Natural Gas may offer better long opportunity at 72% confidence.',
    similarSetupSuccess: 65, holdDuration: '4-24 hours', createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 43200000).toISOString()
  },
  {
    id: 'sig_natgas_1', assetId: 'natgas', assetSymbol: 'NG/USD', assetName: 'Natural Gas', market: 'oil',
    action: 'buy', confidence: 79, risk: 'high', marketStatus: 'neutral',
    entryZone: [2.28, 2.38], stopLoss: 2.15, takeProfit1: 2.65, takeProfit2: 2.90,
    setupQuality: 74, timeframe: '1d',
    explanation: 'Natural Gas showing seasonal bottoming pattern. Storage levels declining faster than 5-year average. Cold weather forecast for eastern US next 2 weeks. Price holding above 200 DMA. Higher risk due to NG volatility — position size accordingly.',
    advancedExplanation: 'LAYER 1: Seasonal analysis shows NG typically bottoms in Feb-Mar. Current storage draw -89 BCF vs 5yr avg -62 BCF. LAYER 2: RSI(14)=45.2 (neutral), MACD about to cross bullish, 200 DMA at $2.18 providing support. Seasonal COT: large specs net long increasing. LAYER 3: Regime = SEASONAL BOTTOM with WEATHER CATALYST. LAYER 4: Score 79/100. Seasonal pattern: 82%. Storage data: 78%. Weather catalyst: 76%. LAYER 5: Speculative long with seasonal and fundamental support. HIGH RISK — use small position size.',
    similarSetupSuccess: 61, holdDuration: '1-7 days', createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 172800000).toISOString()
  },
];

export const alternativeAssets: AlternativeAsset[] = [
  { assetId: 'btc', symbol: 'BTC/USDT', name: 'Bitcoin', confidence: 94, action: 'buy', market: 'crypto' },
  { assetId: 'xauusd', symbol: 'XAU/USD', name: 'Gold Spot', confidence: 91, action: 'buy', market: 'gold' },
  { assetId: 'eth', symbol: 'ETH/USDT', name: 'Ethereum', confidence: 89, action: 'buy', market: 'crypto' },
  { assetId: 'sol', symbol: 'SOL/USDT', name: 'Solana', confidence: 88, action: 'buy', market: 'crypto' },
  { assetId: 'xagusd', symbol: 'XAG/USD', name: 'Silver', confidence: 86, action: 'buy', market: 'silver' },
  { assetId: 'bnb', symbol: 'BNB/USDT', name: 'BNB', confidence: 78, action: 'buy', market: 'crypto' },
  { assetId: 'brent', symbol: 'BRENT/USD', name: 'Brent Crude', confidence: 72, action: 'sell', market: 'oil' },
  { assetId: 'render', symbol: 'RNDR/USDT', name: 'Render', confidence: 69, action: 'buy', market: 'crypto' },
];

export const plans: Plan[] = [
  {
    id: 'free', name: 'Free', price: 0, period: '', signals: 3, validity: 'Total',
    features: ['3 free signal requests total', 'All supported markets', 'Crypto, Gold, Oil, Silver', 'Standard confidence analysis', 'Simple explanation', 'Safer alternative suggestions']
  },
  {
    id: 'starter', name: 'Starter', price: 2.99, period: '7 days', signals: 12, validity: '7 days',
    features: ['12 signal requests', 'Valid for 7 days', 'All four markets', 'Simple explanation', 'Confidence + Risk view', 'Signal history']
  },
  {
    id: 'active', name: 'Active Trader', price: 9.99, period: '30 days', signals: 25, validity: '30 days',
    features: ['25 signal requests', 'Valid for 30 days', 'All four markets', 'Better signal history', 'Watchlist alerts', 'Multi-timeframe signal view'],
    highlighted: true
  },
  {
    id: 'pro', name: 'Pro Trader', price: 29.99, period: '30 days', signals: 120, validity: '30 days',
    features: ['120 signal requests', 'Valid for 30 days', 'All four markets', 'Advanced explanation mode', 'Block allocation assistant', 'Priority signal generation', 'Deeper analytics'],
    badge: 'Popular'
  },
  {
    id: 'unlimited', name: 'Unlimited', price: 39.99, period: '/month', signals: -1, validity: 'Monthly',
    features: ['Unlimited signal requests', 'All four markets', 'Full AI explanation', 'Safer alternative recommendations', 'Watchlist + Alerts', 'Multi-timeframe analysis', 'Advanced dashboard', 'Top opportunities scanner', 'Priority processing'],
    badge: 'Best Value'
  }
];

export const faqs: FAQ[] = [
  { id: '1', question: 'How does Trendora generate signals?', answer: 'Trendora uses a 6-layer hybrid engine: live market data, 30+ technical indicators, market regime detection, multi-factor signal scoring, AI-powered explanations, and cross-asset opportunity ranking.', category: 'Signals' },
  { id: '2', question: 'How accurate are Trendora signals?', answer: 'Each signal shows setup confidence, historical success rate for similar setups, and risk level. The system is designed to filter weak setups and only show higher-quality opportunities instead of forcing a trade.', category: 'Signals' },
  { id: '3', question: 'What markets does Trendora support?', answer: 'We support 40+ assets across 4 markets: Crypto (BTC, ETH, SOL, BNB, GAS tokens, and 20+ altcoins), Gold (XAU/USD, XAU/EUR, XAU/GBP, Gold Futures), Silver (XAG/USD, XAG/EUR, Silver Futures), and Oil/Energy (WTI, Brent, Natural Gas, Heating Oil, RBOB Gasoline).', category: 'General' },
  { id: '4', question: 'What happens if no signal is available?', answer: 'When conditions don\'t meet our high threshold, we honestly tell you "No strong setup right now" and suggest alternative assets with better confidence scores across all markets. This restraint improves trust and your outcomes.', category: 'Signals' },
  { id: '5', question: 'Can I use Trendora as a beginner?', answer: 'Absolutely! Trendora provides simple explanations for every signal, a learning section with 8 modules, and guided onboarding. Our beginner mode explains everything in plain language with risk warnings.', category: 'Getting Started' },
  { id: '6', question: 'How do signal credits work?', answer: 'Each AI signal request uses one credit. Free users get 3 total credits. Paid plans offer 12-120 credits or unlimited. Credits are valid for the plan period. The Unlimited plan has no limits with fair-use protection.', category: 'Billing' },
  { id: '7', question: 'What payment methods do you accept?', answer: 'International: Visa, Mastercard, Apple Pay, Google Pay, PayPal. Regional: Easypaisa, JazzCash, Bank Transfer, Paymob. Crypto: USDT (TRC-20/ERC-20), Binance Pay. We support 15+ payment methods across 50+ countries.', category: 'Billing' },
  { id: '8', question: 'Is my data secure?', answer: 'Trendora uses security-first architecture: TLS 1.3 encryption, WAF protection, rate limiting, CSRF/XSS/SQLi protection, 2FA for admins, encrypted session management, and audit logging. We never store raw card data.', category: 'Security' },
];

export const adminStats: AdminStats = {
  totalUsers: 12847,
  activeSubscribers: 3891,
  freeUsers: 8956,
  mrr: 155520,
  churnRate: 4.2,
  conversionRate: 30.3,
  totalSignalsGenerated: 284920,
  avgConfidence: 67.3,
};

export const sampleNotifications: Notification[] = [
  { id: '1', type: 'signal', title: 'BTC High-Confidence Signal', message: '94% confidence BUY signal detected for BTC/USDT on 4H timeframe', read: false, createdAt: new Date(Date.now() - 300000).toISOString() },
  { id: '2', type: 'alert', title: 'XAU/USD Watchlist Alert', message: 'Gold has broken above your $2,350 alert threshold', read: false, createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: '3', type: 'billing', title: 'Plan Renewal', message: 'Your Active Trader plan renews in 3 days', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', type: 'system', title: '6-Layer Engine Update', message: 'Our signal engine now includes Wyckoff phase analysis for even better accuracy', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export const topOpportunities = [
  { assetId: 'btc', symbol: 'BTC/USDT', name: 'Bitcoin', confidence: 94, action: 'buy' as const, change24h: 2.34 },
  { assetId: 'xauusd', symbol: 'XAU/USD', name: 'Gold', confidence: 91, action: 'buy' as const, change24h: 0.45 },
  { assetId: 'eth', symbol: 'ETH/USDT', name: 'Ethereum', confidence: 89, action: 'buy' as const, change24h: -1.12 },
  { assetId: 'sol', symbol: 'SOL/USDT', name: 'Solana', confidence: 88, action: 'buy' as const, change24h: 5.67 },
  { assetId: 'xagusd', symbol: 'XAG/USD', name: 'Silver', confidence: 86, action: 'buy' as const, change24h: 1.67 },
  { assetId: 'bnb', symbol: 'BNB/USDT', name: 'BNB', confidence: 78, action: 'buy' as const, change24h: 0.89 },
];

export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
];

export const learningModules = [
  { id: '1', title: 'Understanding the 6-Layer Engine', description: 'How Trendora\'s hybrid system outperforms single-indicator tools', duration: '8 min read', category: 'Basics', icon: '🧠' },
  { id: '2', title: 'Reading Confidence Scores', description: 'What 94% confidence means vs 65% — and how to act on each', duration: '5 min read', category: 'Basics', icon: '📊' },
  { id: '3', title: 'Risk Management Masterclass', description: 'Stop-losses, position sizing, and capital preservation strategies', duration: '10 min read', category: 'Risk', icon: '🛡️' },
  { id: '4', title: 'Market Regimes Explained', description: 'Trending, ranging, volatile, and uncertain — how to adapt your strategy', duration: '7 min read', category: 'Advanced', icon: '📈' },
  { id: '5', title: 'Multi-Timeframe Analysis', description: 'Why aligning 1H, 4H, and 1D signals dramatically improves your edge', duration: '9 min read', category: 'Advanced', icon: '⏱️' },
  { id: '6', title: 'When Not to Trade', description: 'The most profitable skill: knowing when "no signal" is the best signal', duration: '5 min read', category: 'Mindset', icon: '🧘' },
  { id: '7', title: 'Block Allocation Strategy', description: 'How to divide capital across multiple signals using risk-based allocation', duration: '8 min read', category: 'Advanced', icon: '🧱' },
  { id: '8', title: 'Live Signal Quality', description: 'Understanding why clean data, confirmation, and risk filters matter', duration: '6 min read', category: 'Signals', icon: '⚡' },
  { id: '9', title: 'Understanding Wyckoff Phases', description: 'Accumulation, markup, distribution, markdown — reading institutional flow', duration: '12 min read', category: 'Advanced', icon: '🏛️' },
  { id: '10', title: 'Order Flow & Smart Money', description: 'How to read volume profiles and detect institutional accumulation', duration: '10 min read', category: 'Advanced', icon: '🐋' },
];

// === PAYMENT METHODS CONFIG ===
export const paymentMethods = [
  // International
  { id: 'visa', label: 'Visa', icon: '💳', category: 'international', regions: ['global'], enabled: true },
  { id: 'mastercard', label: 'Mastercard', icon: '💳', category: 'international', regions: ['global'], enabled: true },
  { id: 'apple_pay', label: 'Apple Pay', icon: '🍎', category: 'international', regions: ['US','EU','GB','AE','AU','CA'], enabled: true },
  { id: 'google_pay', label: 'Google Pay', icon: '📱', category: 'international', regions: ['US','EU','GB','AE','AU','CA'], enabled: true },
  { id: 'paypal', label: 'PayPal', icon: '🅿️', category: 'international', regions: ['global'], enabled: true },
  { id: 'stripe', label: 'Stripe', icon: '💳', category: 'international', regions: ['global'], enabled: true },
  // Pakistan
  { id: 'easypaisa', label: 'Easypaisa', icon: '📲', category: 'pakistan', regions: ['PK'], enabled: true },
  { id: 'jazzcash', label: 'JazzCash', icon: '📲', category: 'pakistan', regions: ['PK'], enabled: true },
  { id: 'hbl', label: 'HBL Direct', icon: '🏦', category: 'pakistan', regions: ['PK'], enabled: false },
  { id: 'ubl', label: 'UBL Digital', icon: '🏦', category: 'pakistan', regions: ['PK'], enabled: false },
  { id: 'mcb', label: 'MCB Mobile', icon: '🏦', category: 'pakistan', regions: ['PK'], enabled: false },
  { id: 'bank_alfalah', label: 'Bank Alfalah', icon: '🏦', category: 'pakistan', regions: ['PK'], enabled: false },
  // Middle East
  { id: 'paytabs', label: 'PayTabs', icon: '💳', category: 'middle_east', regions: ['AE','SA','EG','JO'], enabled: true },
  { id: 'paymob', label: 'Paymob', icon: '💳', category: 'middle_east', regions: ['EG','AE','SA'], enabled: true },
  { id: 'tabby', label: 'Tabby (BNPL)', icon: '🛒', category: 'middle_east', regions: ['AE','SA'], enabled: false },
  { id: 'tamara', label: 'Tamara (BNPL)', icon: '🛒', category: 'middle_east', regions: ['AE','SA'], enabled: false },
  // South/Southeast Asia
  { id: 'bkash', label: 'bKash', icon: '📲', category: 'south_asia', regions: ['BD'], enabled: true },
  { id: 'nagad', label: 'Nagad', icon: '📲', category: 'south_asia', regions: ['BD'], enabled: false },
  { id: 'upi', label: 'UPI', icon: '📱', category: 'south_asia', regions: ['IN'], enabled: true },
  { id: 'paytm', label: 'Paytm', icon: '📱', category: 'south_asia', regions: ['IN'], enabled: true },
  { id: 'razorpay', label: 'Razorpay', icon: '💳', category: 'south_asia', regions: ['IN'], enabled: true },
  { id: 'gcash', label: 'GCash', icon: '📲', category: 'southeast_asia', regions: ['PH'], enabled: false },
  { id: 'dana', label: 'DANA', icon: '📲', category: 'southeast_asia', regions: ['ID'], enabled: false },
  { id: 'ovo', label: 'OVO', icon: '📲', category: 'southeast_asia', regions: ['ID'], enabled: false },
  // Turkey
  { id: 'iyzico', label: 'iyzico', icon: '💳', category: 'turkey', regions: ['TR'], enabled: true },
  { id: 'papara', label: 'Papara', icon: '📱', category: 'turkey', regions: ['TR'], enabled: false },
  // Africa
  { id: 'flutterwave', label: 'Flutterwave', icon: '💳', category: 'africa', regions: ['NG','KE','GH','ZA'], enabled: true },
  { id: 'paystack', label: 'Paystack', icon: '💳', category: 'africa', regions: ['NG','GH','ZA'], enabled: true },
  { id: 'mpesa', label: 'M-Pesa', icon: '📲', category: 'africa', regions: ['KE'], enabled: false },
  // Latin America
  { id: 'mercadopago', label: 'Mercado Pago', icon: '💳', category: 'latam', regions: ['BR','AR','MX'], enabled: true },
  { id: 'pix', label: 'Pix', icon: '📱', category: 'latam', regions: ['BR'], enabled: true },
  { id: 'pse', label: 'PSE', icon: '🏦', category: 'latam', regions: ['CO'], enabled: false },
  // Crypto
  { id: 'usdt_trc20', label: 'USDT (TRC-20)', icon: '₮', category: 'crypto', regions: ['global'], enabled: true },
  { id: 'usdt_erc20', label: 'USDT (ERC-20)', icon: '₮', category: 'crypto', regions: ['global'], enabled: true },
  { id: 'binance_pay', label: 'Binance Pay', icon: '🅱️', category: 'crypto', regions: ['global'], enabled: true },
  { id: 'usdc', label: 'USDC', icon: '💲', category: 'crypto', regions: ['global'], enabled: false },
  // Bank Transfer
  { id: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', category: 'bank', regions: ['global'], enabled: true },
  { id: 'wise', label: 'Wise Transfer', icon: '💸', category: 'bank', regions: ['global'], enabled: false },
];
