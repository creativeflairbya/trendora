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
  { id: 'gold_futures', label: 'Gold Futures', name: 'COMEX Gold', market: 'Gold', symbol: 'COMEX:GC1!' },
  { id: 'xagusd', label: 'XAG/USD', name: 'Silver Spot', market: 'Silver', symbol: 'OANDA:XAGUSD' },
  { id: 'silver_futures', label: 'Silver Futures', name: 'COMEX Silver', market: 'Silver', symbol: 'COMEX:SI1!' },
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

const markets = ['All', 'Crypto', 'Gold', 'Silver', 'Oil', 'Gas'] as const;

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

interface OptionATradingViewChartProps {
  initialAssetId?: string;
  onAssetChange?: (assetId: string) => void;
  onCurrentPriceChange?: (price: number | null) => void;
}

export default function OptionATradingViewChart({ initialAssetId = 'xauusd', onAssetChange, onCurrentPriceChange }: OptionATradingViewChartProps) {
  const [selectedAsset, setSelectedAsset] = useState<TvAsset>(assets.find(asset => asset.id === initialAssetId) || assets.find(asset => asset.id === 'xauusd') || assets[0]);
  const [interval, setInterval] = useState('5');
  const [market, setMarket] = useState<TvAsset['market'] | 'All'>('All');
  const [query, setQuery] = useState('');
  const [chartPrice, setChartPrice] = useState('');
  const containerId = useMemo(() => `option-a-tv-${Math.random().toString(36).slice(2)}`, []);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const visibleAssets = assets.filter(asset => {
    const marketMatch = market === 'All' || asset.market === market;
    const queryMatch = !query || `${asset.label} ${asset.name}`.toLowerCase().includes(query.toLowerCase());
    return marketMatch && queryMatch;
  });

  const selectAssetById = (assetId: string) => {
    const next = assets.find(asset => asset.id === assetId);
    if (next) handleSelectAsset(next);
  };

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

  useEffect(() => {
    const next = assets.find(asset => asset.id === initialAssetId);
    if (next && next.id !== selectedAsset.id) setSelectedAsset(next);
  }, [initialAssetId]);

  const handleSelectAsset = (asset: TvAsset) => {
    setSelectedAsset(asset);
    setChartPrice('');
    onCurrentPriceChange?.(null);
    onAssetChange?.(asset.id);
  };

  const handlePriceChange = (value: string) => {
    setChartPrice(value);
    const parsed = Number(value.replace(/,/g, '').trim());
    onCurrentPriceChange?.(Number.isFinite(parsed) && parsed > 0 ? parsed : null);
  };

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
      <div className="p-4 border-b border-gray-800 space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-bold text-lg">Option A Live Chart</h3>
            <p className="text-xs text-gray-500">TradingView chart with crypto, gold, silver, oil, and gas markets.</p>
          </div>
          <div className="grid gap-2 md:grid-cols-[140px_1fr_1fr] md:w-[46rem]">
            <select
              value={market}
              onChange={event => setMarket(event.target.value as typeof market)}
              className="w-full rounded-xl bg-gray-950 border border-gray-800 py-2 px-3 text-sm outline-none focus:border-cyan-500"
            >
              {markets.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
            <select
              value={selectedAsset.id}
              onChange={event => selectAssetById(event.target.value)}
              className="w-full rounded-xl bg-gray-950 border border-gray-800 py-2 px-3 text-sm outline-none focus:border-cyan-500"
            >
              {visibleAssets.map(asset => <option key={asset.id} value={asset.id}>{asset.label} - {asset.name}</option>)}
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search market..." className="w-full rounded-xl bg-gray-950 border border-gray-800 py-2 pl-9 pr-3 text-sm outline-none focus:border-cyan-500" />
            </div>
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-[1fr_180px]">
          <input
            value={chartPrice}
            onChange={event => handlePriceChange(event.target.value)}
            placeholder="Type exact visible TradingView chart price before signal"
            className="w-full rounded-xl bg-gray-950 border border-amber-500/40 py-2 px-3 text-sm outline-none focus:border-amber-400 font-mono"
          />
          <select
            value={interval}
            onChange={event => setInterval(event.target.value)}
            className="w-full rounded-xl bg-gray-950 border border-gray-800 py-2 px-3 text-sm outline-none focus:border-cyan-500"
          >
            {intervals.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {visibleAssets.map(asset => (
            <button key={asset.id} onClick={() => handleSelectAsset(asset)} className={`rounded-xl px-3 py-2 text-left min-w-[120px] ${selectedAsset.id === asset.id ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-200' : 'bg-gray-950 border border-gray-800 text-gray-400'}`}>
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
      <div className="border-t border-gray-800 bg-gray-950 px-4 py-3 text-xs text-amber-300">
        TradingView widgets do not expose their live price to external apps. Enter the visible chart price above before generating a signal so signal values match the chart exactly.
      </div>
    </div>
  );
}
