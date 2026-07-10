import { Timeframe } from '../types';

export interface BinanceKline {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TimeframeSignalScore {
  timeframe: Timeframe;
  rsi: number;
  macd: number;
  ema: number;
  bollinger: number;
  volume: number;
  score: number;
  bias: 'bullish' | 'bearish' | 'neutral';
}

export interface BinanceConfluenceResult {
  symbol: string;
  timeframes: Timeframe[];
  scores: TimeframeSignalScore[];
  confluenceScore: number;
  direction: 'buy' | 'sell' | 'wait';
  fundingRate?: number;
  openInterest?: number;
  sentimentScore: number;
  explanation: string;
}

const intervalMap: Partial<Record<Timeframe, string>> = {
  '1m': '1m',
  '5m': '5m',
  '10m': '15m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1h',
  '4h': '4h',
  '1d': '1d',
};

function ema(values: number[], period: number) {
  if (values.length < period) return values[values.length - 1] || 0;
  const multiplier = 2 / (period + 1);
  return values.reduce((prev, value, index) => index === 0 ? value : (value - prev) * multiplier + prev, values[0]);
}

function rsi(values: number[], period = 14) {
  if (values.length <= period) return 50;
  let gains = 0;
  let losses = 0;
  const start = values.length - period;
  for (let i = start; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    if (change >= 0) gains += change;
    else losses += Math.abs(change);
  }
  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - 100 / (1 + rs);
}

function standardDeviation(values: number[]) {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function normalizeScore(value: number) {
  return Math.max(-5, Math.min(5, Math.round(value)));
}

function scoreTimeframe(timeframe: Timeframe, klines: BinanceKline[]): TimeframeSignalScore {
  const closes = klines.map(k => k.close);
  const volumes = klines.map(k => k.volume);
  const lastClose = closes[closes.length - 1] || 0;
  const rsiValue = rsi(closes);
  const emaFast = ema(closes.slice(-80), 9);
  const emaSlow = ema(closes.slice(-80), 21);
  const macdLine = ema(closes.slice(-80), 12) - ema(closes.slice(-80), 26);
  const recent = closes.slice(-20);
  const basis = recent.reduce((sum, value) => sum + value, 0) / Math.max(recent.length, 1);
  const deviation = standardDeviation(recent);
  const upper = basis + deviation * 2;
  const lower = basis - deviation * 2;
  const avgVolume = volumes.slice(-20).reduce((sum, value) => sum + value, 0) / Math.max(volumes.slice(-20).length, 1);
  const lastVolume = volumes[volumes.length - 1] || avgVolume;

  const rsiScore = rsiValue > 58 ? 1 : rsiValue < 42 ? -1 : 0;
  const macdScore = macdLine > 0 ? 1 : macdLine < 0 ? -1 : 0;
  const emaScore = emaFast > emaSlow ? 1 : emaFast < emaSlow ? -1 : 0;
  const bbScore = lastClose > upper ? -1 : lastClose < lower ? 1 : lastClose > basis ? 0.5 : -0.5;
  const volumeScore = lastVolume > avgVolume * 1.2 ? (lastClose >= (closes[closes.length - 2] || lastClose) ? 1 : -1) : 0;
  const score = normalizeScore(rsiScore + macdScore + emaScore + bbScore + volumeScore);

  return {
    timeframe,
    rsi: Number(rsiValue.toFixed(2)),
    macd: Number(macdLine.toFixed(4)),
    ema: Number((emaFast - emaSlow).toFixed(4)),
    bollinger: Number((lastClose - basis).toFixed(4)),
    volume: Number((lastVolume / Math.max(avgVolume, 1)).toFixed(2)),
    score,
    bias: score >= 2 ? 'bullish' : score <= -2 ? 'bearish' : 'neutral',
  };
}

async function fetchKlines(symbol: string, timeframe: Timeframe): Promise<BinanceKline[]> {
  const interval = intervalMap[timeframe] || '15m';
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=120`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Binance klines failed: ${symbol} ${interval}`);
  const rows = await response.json();
  return rows.map((row: any[]) => ({
    openTime: Number(row[0]),
    open: Number(row[1]),
    high: Number(row[2]),
    low: Number(row[3]),
    close: Number(row[4]),
    volume: Number(row[5]),
  }));
}

async function fetchFundingAndOi(symbol: string) {
  try {
    const [premium, oi] = await Promise.all([
      fetch(`https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${symbol}`).then(res => res.ok ? res.json() : null),
      fetch(`https://fapi.binance.com/fapi/v1/openInterest?symbol=${symbol}`).then(res => res.ok ? res.json() : null),
    ]);
    return {
      fundingRate: premium ? Number(premium.lastFundingRate) : undefined,
      openInterest: oi ? Number(oi.openInterest) : undefined,
    };
  } catch {
    return {};
  }
}

export async function analyzeBinanceConfluence(symbol: string, timeframes: Timeframe[] = ['5m', '15m', '30m', '1h', '4h', '1d']): Promise<BinanceConfluenceResult> {
  const normalizedSymbol = symbol.replace('/', '').replace('PERP', '').toUpperCase();
  const usableSymbol = normalizedSymbol.endsWith('USDT') ? normalizedSymbol : `${normalizedSymbol}USDT`;
  const scores = await Promise.all(timeframes.map(async timeframe => scoreTimeframe(timeframe, await fetchKlines(usableSymbol, timeframe))));
  const confluenceScore = normalizeScore(scores.reduce((sum, item) => sum + item.score, 0) / Math.max(scores.length, 1));
  const { fundingRate, openInterest } = await fetchFundingAndOi(usableSymbol);
  const sentimentScore = fundingRate === undefined ? 0 : fundingRate > 0.0001 ? -1 : fundingRate < -0.0001 ? 1 : 0;
  const finalScore = normalizeScore(confluenceScore + sentimentScore);
  const direction = finalScore >= 2 ? 'buy' : finalScore <= -2 ? 'sell' : 'wait';
  const bullish = scores.filter(score => score.bias === 'bullish').map(score => score.timeframe).join(', ') || 'none';
  const bearish = scores.filter(score => score.bias === 'bearish').map(score => score.timeframe).join(', ') || 'none';

  return {
    symbol: usableSymbol,
    timeframes,
    scores,
    confluenceScore: finalScore,
    direction,
    fundingRate,
    openInterest,
    sentimentScore,
    explanation: `Multi-timeframe confluence: bullish on ${bullish}; bearish on ${bearish}. Final confluence score ${finalScore}/5 using RSI, MACD, EMA, Bollinger position, volume, funding and open-interest context.`,
  };
}
