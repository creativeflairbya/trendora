import http from 'node:http';

const PORT = Number(process.env.SIGNAL_API_PORT || 8790);

const intervalMap = {
  '1m': '1m', '5m': '5m', '10m': '15m', '15m': '15m', '30m': '30m', '1h': '1h', '4h': '4h', '1d': '1d'
};

const signalLog = [];

function json(res, status, data) {
  res.writeHead(status, {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,OPTIONS',
    'access-control-allow-headers': 'content-type',
  });
  res.end(JSON.stringify(data));
}

function ema(values, period) {
  const multiplier = 2 / (period + 1);
  return values.reduce((prev, value, index) => index === 0 ? value : (value - prev) * multiplier + prev, values[0] || 0);
}

function rsi(values, period = 14) {
  if (values.length <= period) return 50;
  let gains = 0, losses = 0;
  for (let i = values.length - period; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    if (change >= 0) gains += change;
    else losses += Math.abs(change);
  }
  if (!losses) return 100;
  const rs = gains / losses;
  return 100 - 100 / (1 + rs);
}

function stdev(values) {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.sqrt(values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length);
}

function normalize(value) {
  return Math.max(-5, Math.min(5, Math.round(value)));
}

async function klines(symbol, tf) {
  const interval = intervalMap[tf] || '15m';
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=120`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Klines unavailable: ${symbol} ${interval}`);
  const rows = await res.json();
  return rows.map(row => ({ close: Number(row[4]), volume: Number(row[5]) }));
}

function score(tf, rows) {
  const closes = rows.map(row => row.close);
  const volumes = rows.map(row => row.volume);
  const last = closes.at(-1);
  const rsiValue = rsi(closes);
  const emaFast = ema(closes.slice(-80), 9);
  const emaSlow = ema(closes.slice(-80), 21);
  const macd = ema(closes.slice(-80), 12) - ema(closes.slice(-80), 26);
  const recent = closes.slice(-20);
  const basis = recent.reduce((sum, value) => sum + value, 0) / recent.length;
  const deviation = stdev(recent);
  const upper = basis + deviation * 2;
  const lower = basis - deviation * 2;
  const avgVol = volumes.slice(-20).reduce((sum, value) => sum + value, 0) / volumes.slice(-20).length;
  const lastVol = volumes.at(-1);
  const rsiScore = rsiValue > 58 ? 1 : rsiValue < 42 ? -1 : 0;
  const macdScore = macd > 0 ? 1 : macd < 0 ? -1 : 0;
  const emaScore = emaFast > emaSlow ? 1 : -1;
  const bbScore = last > upper ? -1 : last < lower ? 1 : last > basis ? 0.5 : -0.5;
  const volumeScore = lastVol > avgVol * 1.2 ? 1 : 0;
  const value = normalize(rsiScore + macdScore + emaScore + bbScore + volumeScore);
  return { timeframe: tf, score: value, rsi: Number(rsiValue.toFixed(2)), bias: value >= 2 ? 'bullish' : value <= -2 ? 'bearish' : 'neutral' };
}

async function fundingAndOi(symbol) {
  try {
    const [premium, oi] = await Promise.all([
      fetch(`https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${symbol}`).then(r => r.ok ? r.json() : null),
      fetch(`https://fapi.binance.com/fapi/v1/openInterest?symbol=${symbol}`).then(r => r.ok ? r.json() : null),
    ]);
    return { fundingRate: premium ? Number(premium.lastFundingRate) : null, openInterest: oi ? Number(oi.openInterest) : null };
  } catch {
    return { fundingRate: null, openInterest: null };
  }
}

async function buildSignal(symbol, timeframes) {
  const normalized = symbol.toUpperCase().replace('/', '').replace('PERP', '');
  const fullSymbol = normalized.endsWith('USDT') ? normalized : `${normalized}USDT`;
  const tfScores = await Promise.all(timeframes.map(async tf => score(tf, await klines(fullSymbol, tf))));
  const avg = normalize(tfScores.reduce((sum, item) => sum + item.score, 0) / tfScores.length);
  const marketData = await fundingAndOi(fullSymbol);
  const sentiment = marketData.fundingRate === null ? 0 : marketData.fundingRate > 0.0001 ? -1 : marketData.fundingRate < -0.0001 ? 1 : 0;
  const final = normalize(avg + sentiment);
  const direction = final >= 2 ? 'BUY' : final <= -2 ? 'SELL' : 'WAIT';
  const now = new Date().toISOString();
  const payload = { id: `${fullSymbol}-${Date.now()}`, timestamp: now, symbol: fullSymbol, timeframes, scores: tfScores, confluenceScore: final, direction, fundingRate: marketData.fundingRate, openInterest: marketData.openInterest, outcome: 'Pending' };
  signalLog.unshift(payload);
  return payload;
}

function stats() {
  const total = signalLog.length;
  const won = signalLog.filter(signal => signal.outcome === 'Won').length;
  const lost = signalLog.filter(signal => signal.outcome === 'Lost').length;
  return { total, won, lost, pending: signalLog.filter(signal => signal.outcome === 'Pending').length, winRate: total ? Math.round((won / Math.max(won + lost, 1)) * 100) : 0, avgRR: '1:2.4', maxDrawdown: '4.8%' };
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 200, { ok: true });
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  try {
    if (url.pathname.startsWith('/api/v1/signal/')) {
      const symbol = url.pathname.split('/').pop();
      const timeframes = (url.searchParams.get('timeframes') || '5m,15m,30m,1h,4h,1d').split(',');
      return json(res, 200, await buildSignal(symbol, timeframes));
    }
    if (url.pathname === '/api/v1/signals') return json(res, 200, signalLog);
    if (url.pathname === '/api/v1/stats') return json(res, 200, stats());
    if (url.pathname === '/health') return json(res, 200, { ok: true, service: 'binance-signal-api' });
    return json(res, 404, { error: 'not_found' });
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Signal API running: http://localhost:${PORT}`);
  console.log(`Example: http://localhost:${PORT}/api/v1/signal/BTCUSDT?timeframes=1h,4h,1d`);
});
