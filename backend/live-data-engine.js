import http from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = Number(process.env.PORT || 8787);
const BITGET_WS_URL = 'wss://ws.bitget.com/v2/ws/public';
const BITGET_REST_URL = 'https://api.bitget.com/api/v2/mix/market/history-candles';

const BITGET_SYMBOLS = {
  btc: ['BTCUSDT'], eth: ['ETHUSDT'], bnb: ['BNBUSDT'], sol: ['SOLUSDT'], xrp: ['XRPUSDT'],
  ada: ['ADAUSDT'], avax: ['AVAXUSDT'], doge: ['DOGEUSDT'], dot: ['DOTUSDT'], link: ['LINKUSDT'],
  atom: ['ATOMUSDT'], uni: ['UNIUSDT'], ltc: ['LTCUSDT'], near: ['NEARUSDT'], apt: ['APTUSDT'],
  arb: ['ARBUSDT'], op: ['OPUSDT'], fil: ['FILUSDT'], render: ['RENDERUSDT', 'RNDRUSDT'],
  pepe: ['PEPEUSDT'], shib: ['SHIBUSDT'], sui: ['SUIUSDT'], sei: ['SEIUSDT'], ton: ['TONUSDT'], gas: ['GASUSDT'],
  xauusd: ['XAUTUSDT'], xaueur: ['XAUTUSDT'], xaugbp: ['XAUTUSDT'], gold_futures: ['XAUTUSDT'],
  xagusd: ['XAGUSDT'], xageur: ['XAGUSDT'], silver_futures: ['XAGUSDT'],
  natgas: ['NATGASUSDT', 'GASUSDT'],
  wti: ['OILUSDT', 'WTIUSDT', 'USOILUSDT', 'XTIUSDT'],
  brent: ['BRENTUSDT', 'UKOILUSDT', 'OILUSDT'],
  heating_oil: ['OILUSDT', 'WTIUSDT', 'USOILUSDT', 'XTIUSDT'],
  rbob: ['OILUSDT', 'WTIUSDT', 'USOILUSDT', 'XTIUSDT'],
  uso: ['OILUSDT', 'WTIUSDT', 'USOILUSDT', 'XTIUSDT'],
};

function granularity(timeframe) {
  switch (timeframe) {
    case '1m': return '1m';
    case '5m': return '5m';
    case '10m': return '15m';
    case '15m': return '15m';
    case '30m': return '30m';
    case '1h': return '1H';
    case '4h': return '4H';
    case '1d': return '1D';
    case '1w': return '1W';
    default: return '5m';
  }
}

function candleChannel(timeframe) {
  return `candle${granularity(timeframe)}`;
}

function toCandle(row) {
  const d = new Date(Number(row[0]));
  return {
    time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
    timestamp: Number(row[0]),
    open: Number(row[1]),
    high: Number(row[2]),
    low: Number(row[3]),
    close: Number(row[4]),
    volume: Number(row[5]),
  };
}

async function fetchCandles(assetId, timeframe) {
  const candidates = BITGET_SYMBOLS[assetId] || [];
  for (const symbol of candidates) {
    try {
      const url = `${BITGET_REST_URL}?symbol=${symbol}&productType=USDT-FUTURES&granularity=${granularity(timeframe)}&limit=100`;
      const response = await fetch(url);
      if (!response.ok) continue;
      const payload = await response.json();
      if (!Array.isArray(payload?.data) || payload.data.length === 0) continue;
      return {
        symbol,
        candles: payload.data
          .sort((a, b) => Number(a[0]) - Number(b[0]))
          .map(toCandle)
          .slice(-90),
      };
    } catch (error) {
      console.warn(`[live-engine] ${symbol} REST failed`, error.message);
    }
  }
  return null;
}

function send(client, payload) {
  if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(payload));
}

function handleLiveClient(client, request) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const assetId = (url.searchParams.get('assetId') || 'btc').toLowerCase();
  const timeframe = url.searchParams.get('timeframe') || '5m';
  let upstream = null;
  let pingTimer = null;

  fetchCandles(assetId, timeframe).then(result => {
    if (!result) {
      send(client, { type: 'error', message: `Bitget live symbol unavailable for ${assetId}` });
      return;
    }

    send(client, { type: 'snapshot', assetId, timeframe, symbol: result.symbol, candles: result.candles });

    upstream = new WebSocket(BITGET_WS_URL);
    const channel = candleChannel(timeframe);

    upstream.on('open', () => {
      upstream.send(JSON.stringify({
        op: 'subscribe',
        args: [
          { instType: 'USDT-FUTURES', channel, instId: result.symbol },
          { instType: 'USDT-FUTURES', channel: 'ticker', instId: result.symbol },
        ],
      }));
      send(client, { type: 'connected', assetId, timeframe, symbol: result.symbol });
      pingTimer = setInterval(() => upstream?.readyState === WebSocket.OPEN && upstream.send('ping'), 30_000);
    });

    upstream.on('message', raw => {
      const text = raw.toString();
      if (text === 'pong') return;
      try {
        const payload = JSON.parse(text);
        if (!Array.isArray(payload?.data) || payload.data.length === 0) return;

        if (payload.arg?.channel === 'ticker') {
          const tick = payload.data[0];
          const price = Number(tick.lastPr || tick.markPrice || tick.bidPr);
          if (Number.isFinite(price)) send(client, { type: 'tick', assetId, timeframe, symbol: result.symbol, price, ts: Number(tick.ts || payload.ts || Date.now()) });
          return;
        }

        send(client, { type: 'candle', assetId, timeframe, symbol: result.symbol, candle: toCandle(payload.data[0]) });
      } catch (error) {
        console.warn('[live-engine] upstream parse failed', error.message);
      }
    });

    upstream.on('close', () => send(client, { type: 'disconnected', assetId, timeframe, symbol: result.symbol }));
    upstream.on('error', error => send(client, { type: 'error', message: error.message }));
  });

  client.on('close', () => {
    if (pingTimer) clearInterval(pingTimer);
    if (upstream) upstream.close();
  });
}

const server = http.createServer((request, response) => {
  if (request.url?.startsWith('/health')) {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ ok: true, service: 'trendora-live-data-engine' }));
    return;
  }

  if (request.url?.startsWith('/symbols')) {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify(BITGET_SYMBOLS));
    return;
  }

  response.writeHead(404, { 'content-type': 'application/json' });
  response.end(JSON.stringify({ error: 'not_found' }));
});

const wss = new WebSocketServer({ noServer: true });
server.on('upgrade', (request, socket, head) => {
  if (!request.url?.startsWith('/live')) {
    socket.destroy();
    return;
  }
  wss.handleUpgrade(request, socket, head, ws => handleLiveClient(ws, request));
});

server.listen(PORT, () => {
  console.log(`[live-engine] running on http://localhost:${PORT}`);
  console.log(`[live-engine] websocket path: ws://localhost:${PORT}/live?assetId=btc&timeframe=5m`);
});
