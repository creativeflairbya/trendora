// === LIVE MARKET DATA SERVICE ===
// Fetches real-time prices from CoinGecko (free, no API key needed)
// For commodities (gold, silver, oil), falls back to realistic estimates
// Production: Replace commodity estimates with Alpha Vantage / Twelve Data API

import { Asset, Market, Timeframe } from '../types';

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// CoinGecko ID mapping for all crypto assets
const COINGECKO_MAP: Record<string, string> = {
  btc: 'bitcoin', eth: 'ethereum', bnb: 'binancecoin', sol: 'solana',
  xrp: 'ripple', ada: 'cardano', avax: 'avalanche-2', doge: 'dogecoin',
  dot: 'polkadot', link: 'chainlink', matic: 'matic-network', atom: 'cosmos',
  uni: 'uniswap', ltc: 'litecoin', near: 'near', apt: 'aptos',
  arb: 'arbitrum', op: 'optimism', fil: 'filecoin', render: 'render-token',
  pepe: 'pepe', shib: 'shiba-inu', inu: 'floki', sui: 'sui',
  sei: 'sei-network', ton: 'the-open-network', ftm: 'fantom', egld: 'elrond-erd-2',
  gas: 'gas', ethgas: 'ethereum', maticgas: 'matic-network',
};

// Realistic baseline prices (updated 2025) — used as fallback
export const BASELINE_PRICES: Record<string, { price: number; change: number }> = {
  btc: { price: 104523, change: 2.34 }, eth: { price: 2521, change: -1.12 },
  bnb: { price: 654, change: 0.89 }, sol: { price: 172, change: 5.67 },
  xrp: { price: 2.43, change: -2.45 }, ada: { price: 0.78, change: 1.23 },
  avax: { price: 38, change: -0.56 }, doge: { price: 0.22, change: 8.91 },
  dot: { price: 7.34, change: 2.11 }, link: { price: 18.56, change: 3.45 },
  matic: { price: 0.52, change: -1.78 }, atom: { price: 9.12, change: 1.56 },
  uni: { price: 12.89, change: -0.34 }, ltc: { price: 108, change: 1.89 },
  near: { price: 5.67, change: 4.23 }, apt: { price: 8.92, change: -2.11 },
  arb: { price: 1.12, change: 0.78 }, op: { price: 2.34, change: 3.56 },
  fil: { price: 5.78, change: -0.89 }, render: { price: 7.45, change: 6.78 },
  pepe: { price: 0.0000134, change: 12.34 }, shib: { price: 0.00001567, change: 4.56 },
  inu: { price: 0.000158, change: -3.21 }, sui: { price: 3.78, change: 7.89 },
  sei: { price: 0.45, change: 2.34 }, ton: { price: 6.89, change: 1.23 },
  ftm: { price: 0.78, change: -1.56 }, egld: { price: 34.56, change: 2.67 },
  gas: { price: 5.23, change: 3.45 }, ethgas: { price: 2521, change: -1.12 },
  maticgas: { price: 0.52, change: 1.23 },
  // Commodities — fallback prices. Production should replace these with a broker/exchange feed.
  xauusd: { price: 4028.66, change: 0.45 }, xaueur: { price: 3714.2, change: 0.32 },
  xaugbp: { price: 3195.4, change: 0.56 }, gold_futures: { price: 4032.1, change: 0.51 },
  xagusd: { price: 49.42, change: 1.67 }, xageur: { price: 45.62, change: 1.34 },
  silver_futures: { price: 49.58, change: 1.72 },
  wti: { price: 61.34, change: -1.23 }, brent: { price: 64.56, change: -0.89 },
  natgas: { price: 3.94, change: 3.21 }, heating_oil: { price: 2.15, change: 1.12 },
  rbob: { price: 1.98, change: -0.67 }, uso: { price: 56.34, change: -0.94 },
};

function generateChartData(base: number, points: number = 60): { time: string; price: number }[] {
  const data: { time: string; price: number }[] = [];
  let price = base;
  for (let i = 0; i < points; i++) {
    price += (Math.random() - 0.48) * base * 0.004;
    const h = Math.floor(i * 24 / points);
    const m = (i * 60 / points) % 60;
    data.push({
      time: `${h.toString().padStart(2, '0')}:${Math.floor(m).toString().padStart(2, '0')}`,
      price: parseFloat(price.toFixed(base < 0.01 ? 8 : base < 100 ? 4 : 2)),
    });
  }
  return data;
}

export function generateCandleData(base: number, timeframe: Timeframe = '1m', points: number = 58): CandleData[] {
  const volatilityByFrame: Partial<Record<Timeframe, number>> = {
    '1m': 0.00065,
    '5m': 0.0012,
    '10m': 0.0018,
    '15m': 0.0024,
    '30m': 0.0032,
    '1h': 0.0045,
    '4h': 0.008,
    '1d': 0.014,
    '1w': 0.025,
  };
  const step = volatilityByFrame[timeframe] || 0.002;
  const candles: CandleData[] = [];
  let close = base * (1 - step * points * 0.18);

  for (let i = 0; i < points; i++) {
    const open = close;
    const directionalBias = i > points * 0.55 ? 0.18 : i > points * 0.3 ? 0.05 : -0.03;
    const move = (Math.random() - 0.5 + directionalBias) * base * step * 4;
    close = Math.max(base * 0.05, open + move);
    const high = Math.max(open, close) + Math.random() * base * step * 2.2;
    const low = Math.min(open, close) - Math.random() * base * step * 2.2;
    const d = new Date(Date.now() - (points - i) * 60_000);
    candles.push({
      time: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
      open,
      high,
      low,
      close,
      volume: Math.round(80 + Math.random() * 180 + Math.abs(close - open) / Math.max(base * step, 0.000001) * 45),
    });
  }

  const last = candles[candles.length - 1];
  candles[candles.length - 1] = {
    ...last,
    close: base,
    high: Math.max(last.high, base, last.open),
    low: Math.min(last.low, base, last.open),
  };
  return candles;
}

export function priceSeriesToCandles(series: { time: string; price: number }[], currentPrice: number, timeframe: Timeframe = '1m'): CandleData[] {
  if (!series.length) return generateCandleData(currentPrice, timeframe);
  const bucketSize = Math.max(1, Math.floor(series.length / 58));
  const candles: CandleData[] = [];

  for (let i = 0; i < series.length; i += bucketSize) {
    const bucket = series.slice(i, i + bucketSize);
    if (!bucket.length) continue;
    const prices = bucket.map(point => point.price);
    candles.push({
      time: bucket[bucket.length - 1].time,
      open: prices[0],
      high: Math.max(...prices),
      low: Math.min(...prices),
      close: prices[prices.length - 1],
      volume: Math.round(80 + Math.random() * 220),
    });
  }

  const last = candles[candles.length - 1];
  candles[candles.length - 1] = {
    ...last,
    close: currentPrice,
    high: Math.max(last.high, currentPrice, last.open),
    low: Math.min(last.low, currentPrice, last.open),
  };
  return candles.slice(-58);
}

// Static asset definitions
const ASSET_DEFINITIONS: { id: string; symbol: string; name: string; market: Market }[] = [
  { id: 'btc', symbol: 'BTC/USDT', name: 'Bitcoin', market: 'crypto' },
  { id: 'eth', symbol: 'ETH/USDT', name: 'Ethereum', market: 'crypto' },
  { id: 'bnb', symbol: 'BNB/USDT', name: 'BNB', market: 'crypto' },
  { id: 'sol', symbol: 'SOL/USDT', name: 'Solana', market: 'crypto' },
  { id: 'xrp', symbol: 'XRP/USDT', name: 'Ripple', market: 'crypto' },
  { id: 'ada', symbol: 'ADA/USDT', name: 'Cardano', market: 'crypto' },
  { id: 'avax', symbol: 'AVAX/USDT', name: 'Avalanche', market: 'crypto' },
  { id: 'doge', symbol: 'DOGE/USDT', name: 'Dogecoin', market: 'crypto' },
  { id: 'dot', symbol: 'DOT/USDT', name: 'Polkadot', market: 'crypto' },
  { id: 'link', symbol: 'LINK/USDT', name: 'Chainlink', market: 'crypto' },
  { id: 'matic', symbol: 'MATIC/USDT', name: 'Polygon', market: 'crypto' },
  { id: 'atom', symbol: 'ATOM/USDT', name: 'Cosmos', market: 'crypto' },
  { id: 'uni', symbol: 'UNI/USDT', name: 'Uniswap', market: 'crypto' },
  { id: 'ltc', symbol: 'LTC/USDT', name: 'Litecoin', market: 'crypto' },
  { id: 'near', symbol: 'NEAR/USDT', name: 'NEAR Protocol', market: 'crypto' },
  { id: 'apt', symbol: 'APT/USDT', name: 'Aptos', market: 'crypto' },
  { id: 'arb', symbol: 'ARB/USDT', name: 'Arbitrum', market: 'crypto' },
  { id: 'op', symbol: 'OP/USDT', name: 'Optimism', market: 'crypto' },
  { id: 'fil', symbol: 'FIL/USDT', name: 'Filecoin', market: 'crypto' },
  { id: 'render', symbol: 'RNDR/USDT', name: 'Render', market: 'crypto' },
  { id: 'pepe', symbol: 'PEPE/USDT', name: 'Pepe', market: 'crypto' },
  { id: 'shib', symbol: 'SHIB/USDT', name: 'Shiba Inu', market: 'crypto' },
  { id: 'inu', symbol: 'FLOKI/USDT', name: 'Floki Inu', market: 'crypto' },
  { id: 'sui', symbol: 'SUI/USDT', name: 'Sui', market: 'crypto' },
  { id: 'sei', symbol: 'SEI/USDT', name: 'Sei', market: 'crypto' },
  { id: 'ton', symbol: 'TON/USDT', name: 'Toncoin', market: 'crypto' },
  { id: 'ftm', symbol: 'FTM/USDT', name: 'Fantom', market: 'crypto' },
  { id: 'egld', symbol: 'EGLD/USDT', name: 'MultiversX', market: 'crypto' },
  { id: 'gas', symbol: 'GAS/USDT', name: 'Neo GAS', market: 'crypto' },
  { id: 'ethgas', symbol: 'ETH/GAS', name: 'Ethereum Gas', market: 'crypto' },
  { id: 'maticgas', symbol: 'POL/Gas', name: 'Polygon Gas', market: 'crypto' },
  { id: 'xauusd', symbol: 'XAU/USD', name: 'Gold Spot', market: 'gold' },
  { id: 'xaueur', symbol: 'XAU/EUR', name: 'Gold Euro', market: 'gold' },
  { id: 'xaugbp', symbol: 'XAU/GBP', name: 'Gold Pound', market: 'gold' },
  { id: 'gold_futures', symbol: 'GC=F', name: 'Gold Futures', market: 'gold' },
  { id: 'xagusd', symbol: 'XAG/USD', name: 'Silver Spot', market: 'silver' },
  { id: 'xageur', symbol: 'XAG/EUR', name: 'Silver Euro', market: 'silver' },
  { id: 'silver_futures', symbol: 'SI=F', name: 'Silver Futures', market: 'silver' },
  { id: 'wti', symbol: 'WTI/USD', name: 'Crude Oil WTI', market: 'oil' },
  { id: 'brent', symbol: 'BRENT/USD', name: 'Brent Crude', market: 'oil' },
  { id: 'natgas', symbol: 'NG/USD', name: 'Natural Gas', market: 'oil' },
  { id: 'heating_oil', symbol: 'HO=F', name: 'Heating Oil', market: 'oil' },
  { id: 'rbob', symbol: 'RB=F', name: 'RBOB Gasoline', market: 'oil' },
  { id: 'uso', symbol: 'USO', name: 'US Oil Fund', market: 'oil' },
];

// Build assets from definitions + baseline prices
export function getBaselineAssets(): Asset[] {
  return ASSET_DEFINITIONS.map(def => {
    const bl = BASELINE_PRICES[def.id] || { price: 1, change: 0 };
    return { ...def, price: bl.price, change24h: bl.change, chartData: generateChartData(bl.price) };
  });
}

// Fetch live crypto prices from CoinGecko
export async function fetchLiveCryptoPrices(): Promise<Record<string, { price: number; change: number; chartData?: { time: string; price: number }[] }> | null> {
  try {
    const ids = Object.values(COINGECKO_MAP).filter((v, i, a) => a.indexOf(v) === i).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    const result: Record<string, { price: number; change: number }> = {};
    for (const [assetId, cgId] of Object.entries(COINGECKO_MAP)) {
      if (data[cgId]?.usd) {
        result[assetId] = {
          price: data[cgId].usd,
          change: data[cgId]?.usd_24h_change || 0,
        };
      }
    }
    return result;
  } catch (e) {
    console.warn('CoinGecko fetch failed, using baseline prices:', e);
    return null;
  }
}

// Fetch live chart data from CoinGecko
export async function fetchLiveChart(assetId: string, days: number = 1): Promise<{ time: string; price: number }[] | null> {
  const cgId = COINGECKO_MAP[assetId];
  if (!cgId) return null;
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${cgId}/market_chart?vs_currency=usd&days=${days}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.prices) return null;
    return data.prices.map((p: [number, number]) => {
      const d = new Date(p[0]);
      return { time: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`, price: p[1] };
    }).filter((_: any, i: number, a: any[]) => i % Math.max(1, Math.floor(a.length / 60)) === 0); // Downsample to ~60 points
  } catch (e) {
    console.warn('Chart fetch failed:', e);
    return null;
  }
}

// Apply live prices to assets
export function applyLivePrices(baseline: Asset[], live: Record<string, { price: number; change: number }> | null): Asset[] {
  if (!live) return baseline;
  return baseline.map(asset => {
    const liveData = live[asset.id];
    if (liveData) {
      return { ...asset, price: liveData.price, change24h: parseFloat(liveData.change.toFixed(2)) };
    }
    return asset;
  });
}

// Generate signal based on live price
export function generateLiveSignal(asset: Asset, signalTemplate: any, selectedHold: Timeframe = '5m', referencePrice?: number) {
  const p = referencePrice || asset.price;
  const isBuy = signalTemplate.action === 'buy';
  const riskByHold: Partial<Record<Timeframe, { entry: number; sl: number; tp1: number; tp2: number; confidencePenalty: number }>> = {
    '1m': { entry: 0.00035, sl: 0.0012, tp1: 0.0016, tp2: 0.0024, confidencePenalty: 7 },
    '5m': { entry: 0.00075, sl: 0.0025, tp1: 0.0035, tp2: 0.0055, confidencePenalty: 4 },
    '10m': { entry: 0.0011, sl: 0.0035, tp1: 0.005, tp2: 0.008, confidencePenalty: 3 },
    '15m': { entry: 0.0016, sl: 0.005, tp1: 0.007, tp2: 0.011, confidencePenalty: 2 },
    '30m': { entry: 0.0022, sl: 0.007, tp1: 0.01, tp2: 0.016, confidencePenalty: 1 },
    '1h': { entry: 0.003, sl: 0.01, tp1: 0.016, tp2: 0.026, confidencePenalty: 0 },
    '4h': { entry: 0.0045, sl: 0.018, tp1: 0.032, tp2: 0.052, confidencePenalty: 0 },
    '1d': { entry: 0.006, sl: 0.03, tp1: 0.055, tp2: 0.09, confidencePenalty: 1 },
    '1w': { entry: 0.009, sl: 0.055, tp1: 0.12, tp2: 0.2, confidencePenalty: 3 },
  };
  const risk = riskByHold[selectedHold] || riskByHold['5m']!;
  const entryLow = p * (isBuy ? 1 - risk.entry : 1 + risk.entry);
  const entryHigh = p * (isBuy ? 1 + risk.entry : 1 - risk.entry);
  const sl = p * (isBuy ? 1 - risk.sl : 1 + risk.sl);
  const tp1 = p * (isBuy ? 1 + risk.tp1 : 1 - risk.tp1);
  const tp2 = p * (isBuy ? 1 + risk.tp2 : 1 - risk.tp2);

  const holdDurations: Record<string, Record<string, string>> = {
    '1m': { buy: '1-5 minutes', sell: '1-5 minutes', wait: 'N/A' },
    '5m': { buy: '5-30 minutes', sell: '5-30 minutes', wait: 'N/A' },
    '10m': { buy: '10-45 minutes', sell: '10-45 minutes', wait: 'N/A' },
    '15m': { buy: '15min - 2 hours', sell: '15min - 2 hours', wait: 'N/A' },
    '30m': { buy: '30min - 3 hours', sell: '30min - 3 hours', wait: 'N/A' },
    '1h': { buy: '1-6 hours', sell: '1-6 hours', wait: 'N/A' },
    '4h': { buy: '4-24 hours', sell: '4-24 hours', wait: 'N/A' },
    '1d': { buy: '1-7 days', sell: '1-7 days', wait: 'N/A' },
    '1w': { buy: '1-4 weeks', sell: '1-4 weeks', wait: 'N/A' },
  };

  const tf = selectedHold || signalTemplate.timeframe || '5m';
  const action = signalTemplate.action || 'buy';

  return {
    ...signalTemplate,
    assetId: asset.id,
    assetSymbol: asset.symbol,
    assetName: asset.name,
    market: asset.market,
    timeframe: tf,
    entryZone: [parseFloat(entryLow.toFixed(2)), parseFloat(entryHigh.toFixed(2))] as [number, number],
    stopLoss: parseFloat(sl.toFixed(2)),
    takeProfit1: parseFloat(tp1.toFixed(2)),
    takeProfit2: parseFloat(tp2.toFixed(2)),
    holdDuration: holdDurations[tf]?.[action] || '5-30 minutes',
    confidence: Math.min(99, Math.max(78, signalTemplate.confidence + Math.floor(Math.random() * 8) - risk.confidencePenalty)),
    setupQuality: Math.min(98, Math.max(75, signalTemplate.setupQuality + Math.floor(Math.random() * 10))),
  };
}

export const ASSET_DEFINITIONS_LIST = ASSET_DEFINITIONS;
