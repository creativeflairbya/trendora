import { useEffect, useMemo, useRef } from 'react';
import { Timeframe } from '../types';

declare global {
  interface Window {
    TradingView?: any;
  }
}

const TV_SYMBOLS: Record<string, string> = {
  btc: 'BINANCE:BTCUSDT',
  eth: 'BINANCE:ETHUSDT',
  bnb: 'BINANCE:BNBUSDT',
  sol: 'BINANCE:SOLUSDT',
  xrp: 'BINANCE:XRPUSDT',
  ada: 'BINANCE:ADAUSDT',
  avax: 'BINANCE:AVAXUSDT',
  doge: 'BINANCE:DOGEUSDT',
  dot: 'BINANCE:DOTUSDT',
  link: 'BINANCE:LINKUSDT',
  matic: 'BINANCE:MATICUSDT',
  atom: 'BINANCE:ATOMUSDT',
  uni: 'BINANCE:UNIUSDT',
  ltc: 'BINANCE:LTCUSDT',
  near: 'BINANCE:NEARUSDT',
  apt: 'BINANCE:APTUSDT',
  arb: 'BINANCE:ARBUSDT',
  op: 'BINANCE:OPUSDT',
  fil: 'BINANCE:FILUSDT',
  render: 'BINANCE:RNDRUSDT',
  pepe: 'BINANCE:PEPEUSDT',
  shib: 'BINANCE:SHIBUSDT',
  sui: 'BINANCE:SUIUSDT',
  sei: 'BINANCE:SEIUSDT',
  ton: 'BINANCE:TONUSDT',
  gas: 'BINANCE:GASUSDT',
  xauusd: 'OANDA:XAUUSD',
  xaueur: 'OANDA:XAUEUR',
  xaugbp: 'OANDA:XAUGBP',
  gold_futures: 'COMEX:GC1!',
  xagusd: 'OANDA:XAGUSD',
  xageur: 'OANDA:XAGEUR',
  silver_futures: 'COMEX:SI1!',
  wti: 'TVC:USOIL',
  brent: 'TVC:UKOIL',
  natgas: 'TVC:NATGAS',
  uso: 'AMEX:USO',
};

function tvInterval(timeframe: Timeframe) {
  switch (timeframe) {
    case '1m': return '1';
    case '5m': return '5';
    case '10m': return '10';
    case '15m': return '15';
    case '30m': return '30';
    case '1h': return '60';
    case '4h': return '240';
    case '1d': return 'D';
    case '1w': return 'W';
  }
}

function loadTradingViewScript() {
  return new Promise<void>((resolve) => {
    if (window.TradingView) {
      resolve();
      return;
    }

    const existing = document.getElementById('tradingview-widget-script') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = 'tradingview-widget-script';
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

export default function TradingViewChart({ assetId, timeframe }: { assetId: string; timeframe: Timeframe }) {
  const containerId = useMemo(() => `tv-chart-${assetId}-${timeframe}-${Math.random().toString(36).slice(2)}`, [assetId, timeframe]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const symbol = TV_SYMBOLS[assetId] || 'BINANCE:BTCUSDT';

  useEffect(() => {
    let cancelled = false;

    loadTradingViewScript().then(() => {
      if (cancelled || !window.TradingView || !wrapperRef.current) return;
      wrapperRef.current.innerHTML = `<div id="${containerId}" class="h-full w-full"></div>`;

      new window.TradingView.widget({
        autosize: true,
        symbol,
        interval: tvInterval(timeframe),
        timezone: 'Etc/UTC',
        theme: 'light',
        style: '1',
        locale: 'en',
        toolbar_bg: '#ffffff',
        enable_publishing: false,
        allow_symbol_change: false,
        hide_side_toolbar: false,
        hide_top_toolbar: false,
        save_image: false,
        studies: ['Volume@tv-basicstudies'],
        container_id: containerId,
      });
    });

    return () => {
      cancelled = true;
      if (wrapperRef.current) wrapperRef.current.innerHTML = '';
    };
  }, [assetId, containerId, symbol, timeframe]);

  return (
    <div className="relative h-full w-full bg-white" ref={wrapperRef}>
      <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">Loading live TradingView chart...</div>
    </div>
  );
}
