import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';

declare global {
  interface Window {
    TradingView?: any;
  }
}

type TvAsset = {
  id: string;
  label: string;
  name: string;
  market: 'Crypto' | 'Gold' | 'Silver' | 'Oil' | 'Gas';
  symbol: string;
};

const assets: TvAsset[] = [
  { id: 'btc', label: 'BTC/USDT', name: 'Bitcoin', market: 'Crypto', symbol: 'BINANCE:BTCUSDT' },
  { id: 'eth', label: 'ETH/USDT', name: 'Ethereum', market: 'Crypto', symbol: 'BINANCE:ETHUSDT' },
  { id: 'bnb', label: 'BNB/USDT', name: 'BNB', market: 'Crypto', symbol: 'BINANCE:BNBUSDT' },
  { id: 'sol', label: 'SOL/USDT', name: 'Solana', market: 'Crypto', symbol: 'BINANCE:SOLUSDT' },
  { id: 'xrp', label: 'XRP/USDT', name: 'Ripple', market: 'Crypto', symbol: 'BINANCE:XRPUSDT' },
  { id: 'ada', label: 'ADA/USDT', name: 'Cardano', market: 'Crypto', symbol: 'BINANCE:ADAUSDT' },
  { id: 'doge', label: 'DOGE/USDT', name: 'Dogecoin', market: 'Crypto', symbol: 'BINANCE:DOGEUSDT' },
  { id: 'avax', label: 'AVAX/USDT', name: 'Avalanche', market: 'Crypto', symbol: 'BINANCE:AVAXUSDT' },
  { id: 'link', label: 'LINK/USDT', name: 'Chainlink', market: 'Crypto', symbol: 'BINANCE:LINKUSDT' },
  { id: 'ltc', label: 'LTC/USDT', name: 'Litecoin', market: 'Crypto', symbol: 'BINANCE:LTCUSDT' },
  { id: 'xauusd', label: 'XAU/USD', name: 'Gold Spot', market: 'Gold', symbol: 'OANDA:XAUUSD' },
  { id: 'goldf', label: 'Gold Futures', name: 'COMEX Gold', market: 'Gold', symbol: 'COMEX:GC1!' },
  { id: 'xagusd', label: 'XAG/USD', name: 'Silver Spot', market: 'Silver', symbol: 'OANDA:XAGUSD' },
  { id: 'silverf', label: 'Silver Futures', name: 'COMEX Silver', market: 'Silver', symbol: 'COMEX:SI1!' },
  { id: 'wti', label: 'WTI Oil', name: 'US Oil', market: 'Oil', symbol: 'TVC:USOIL' },
  { id: 'brent', label: 'Brent Oil', name: 'UK Oil', market: 'Oil', symbol: 'TVC:UKOIL' },
  { id: 'natgas', label: 'Natural Gas', name: 'Natural Gas', market: 'Gas', symbol: 'TVC:NATGAS' },
];

const intervals = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  { label: '15m', value: '15' },
  { label: '30m', value: '30' },
  { label: '1H', value: '60' },
  { label: '4H', value: '240' },
  { label: '1D', value: 'D' },
];

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

export default function OptionATradingViewChart() {
  const [selectedAsset, setSelectedAsset] = useState<TvAsset>(assets.find(asset => asset.id === 'xauusd') || assets[0]);
  const [interval, setInterval] = useState('5');
  const [market, setMarket] = useState<TvAsset['market'] | 'All'>('All');
  const [query, setQuery] = useState('');
  const containerId = useMemo(() => `option-a-tv-${Math.random().toString(36).slice(2)}`, []);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const visibleAssets = assets.filter(asset => {
    const marketMatch = market === 'All' || asset.market === market;
    const queryMatch = !query || `${asset.label} ${asset.name}`.toLowerCase().includes(query.toLowerCase());
    return marketMatch && queryMatch;
  });

  useEffect(() => {
    let cancelled = false;
    loadTradingViewScript().then(() => {
      if (cancelled || !window.TradingView || !wrapperRef.current) return;
      wrapperRef.current.innerHTML = `<div id="${containerId}" class="h-full w-full"></div>`;

      new window.TradingView.widget({
        autosize: true,
        symbol: selectedAsset.symbol,
        interval,
        timezone: 'Etc/UTC',
        theme: 'light',
        style: '1',
        locale: 'en',
        toolbar_bg: '#ffffff',
        enable_publishing: false,
        allow_symbol_change: true,
        hide_side_toolbar: false,
        hide_top_toolbar: false,
        save_image: false,
        withdateranges: true,
        studies: ['Volume@tv-basicstudies'],
        container_id: containerId,
      });
    });

    return () => {
      cancelled = true;
      if (wrapperRef.current) wrapperRef.current.innerHTML = '';
    };
  }, [containerId, interval, selectedAsset.symbol]);

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
      <div className="p-4 border-b border-gray-800 space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-bold text-lg">Option A Live Chart</h3>
            <p className="text-xs text-gray-500">TradingView chart with crypto, gold, silver, oil, and gas markets.</p>
          </div>
          <div className="relative md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search market..." className="w-full rounded-xl bg-gray-950 border border-gray-800 py-2 pl-9 pr-3 text-sm outline-none focus:border-cyan-500" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {(['All', 'Crypto', 'Gold', 'Silver', 'Oil', 'Gas'] as const).map(item => (
            <button key={item} onClick={() => setMarket(item)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${market === item ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-gray-950 text-gray-400 border border-gray-800'}`}>
              {item}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {visibleAssets.map(asset => (
            <button key={asset.id} onClick={() => setSelectedAsset(asset)} className={`rounded-xl px-3 py-2 text-left min-w-[120px] ${selectedAsset.id === asset.id ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-200' : 'bg-gray-950 border border-gray-800 text-gray-400'}`}>
              <p className="text-xs font-bold">{asset.label}</p>
              <p className="text-[10px] text-gray-500">{asset.market}</p>
            </button>
          ))}
        </div>

        <div className="flex gap-1 overflow-x-auto">
          {intervals.map(item => (
            <button key={item.value} onClick={() => setInterval(item.value)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${interval === item.value ? 'bg-emerald-500 text-gray-950' : 'bg-gray-950 text-gray-400 border border-gray-800'}`}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[620px] bg-white" ref={wrapperRef}>
        <div className="h-full flex items-center justify-center text-sm text-gray-500">Loading chart...</div>
      </div>
    </div>
  );
}
