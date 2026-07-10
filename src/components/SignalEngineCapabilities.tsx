import { Activity, BarChart3, Brain, History, Radio, ShieldCheck, Sparkles, Target } from 'lucide-react';

const capabilities = [
  { icon: BarChart3, title: 'Multi-Timeframe Analysis', desc: '15m, 1H, 4H, and 1D context checked together.' },
  { icon: Brain, title: 'Ensemble AI Models', desc: 'XGBoost, LSTM, RandomForest, and rule-based confirmation.' },
  { icon: History, title: 'Backtested Context', desc: 'Signals show similar-setup historical success context.' },
  { icon: Activity, title: '50+ Indicators', desc: 'RSI, MACD, ATR, VWAP, Bollinger, Ichimoku, volume, S/R, SMC and more.' },
  { icon: Radio, title: 'Live-Ready Updates', desc: 'Built to support WebSocket market feeds when a verified data source is connected.' },
  { icon: Sparkles, title: 'Explainable AI', desc: 'Every signal includes the reason behind the direction and risk.' },
  { icon: Target, title: 'Better Free Tier', desc: 'Free users can test real AI chart analysis before upgrading.' },
  { icon: ShieldCheck, title: 'Risk Management', desc: 'Entry, stop-loss, take-profits, risk/reward, and position guidance.' },
];

export default function SignalEngineCapabilities({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-white">SignalAnalyst Engine</h3>
          <p className="text-xs text-gray-500">Professional futures signal stack used across both options.</p>
        </div>
        <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-300">V5.0</span>
      </div>
      <div className={`grid gap-3 ${compact ? 'sm:grid-cols-2' : 'md:grid-cols-4'}`}>
        {capabilities.map(item => (
          <div key={item.title} className="rounded-xl border border-gray-800 bg-gray-950/60 p-3">
            <item.icon className="mb-2 h-4 w-4 text-cyan-400" />
            <p className="text-sm font-semibold text-gray-100">{item.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
