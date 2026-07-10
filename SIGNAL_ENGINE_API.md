# SignalAnalyst AI Signal Engine API

This project now includes a Binance-free-data signal API skeleton.

## Start API

```bash
node backend/binance-signal-api.js
```

Default port:

```text
8790
```

## Endpoint

```http
GET /api/v1/signal/:symbol?timeframes=5m,15m,30m,1h,4h,1d
```

Example:

```bash
curl "http://localhost:8790/api/v1/signal/BTCUSDT?timeframes=1h,4h,1d"
```

## What It Uses

- Binance free public klines API
- Binance futures funding rate
- Binance futures open interest
- Multi-timeframe confluence
- RSI
- MACD-style EMA spread
- EMA 9/21 trend
- Bollinger band position
- Volume expansion
- Sentiment proxy from funding rate

## Confluence Score

Each timeframe generates a score from:

```text
-5 bearish to +5 bullish
```

Combined result:

```text
>= +2 BUY
<= -2 SELL
otherwise WAIT
```

## Performance Logging

Every generated signal is stored in memory with:

- timestamp
- symbol
- timeframes
- direction
- confluence score
- funding rate
- open interest
- pending outcome

Endpoints:

```http
GET /api/v1/signals
GET /api/v1/stats
```

## Production Upgrade Needed

For a real launch, replace in-memory storage with PostgreSQL tables:

- signals
- signal_outcomes
- strategy_backtests
- symbol_feeds

Then add a background worker that checks whether price hit TP or SL to auto-resolve outcomes as Won/Lost.

## Gemini Vision Integration

Do not put API keys in frontend code.

Use backend environment variable:

```bash
GEMINI_API_KEY=your_key_here
```

Important: if a key is exposed publicly, rotate it immediately.

## Gemini Chart Analyzer Backend

Start the chart-image analyzer backend:

```bash
GEMINI_API_KEY=your_key_here node backend/gemini-chart-analyzer.js
```

Default port:

```text
8791
```

Endpoint:

```http
POST /api/v1/analyze-chart
```

The frontend will call `/api/v1/analyze-chart` by default. If hosted on another domain, set:

```js
localStorage.setItem('signalanalyst_gemini_endpoint', 'https://your-backend.com/api/v1/analyze-chart')
```

This backend sends the uploaded chart image to Gemini and asks it to return structured JSON:

- symbol
- market
- detected chart price
- timeframe
- hold duration
- direction
- confidence
- setup quality
- risk
- pattern
- explanation
