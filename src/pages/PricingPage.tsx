import { useApp } from '../context/AppContext';
import { plans, paymentMethods } from '../data/mockData';
import { CheckCircle, Zap, Crown, Star, Rocket } from 'lucide-react';
import { useState } from 'react';

export default function PricingPage() {
  const { user, setUser } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentCategory, setPaymentCategory] = useState('international');

  const planIcons: Record<string, React.ReactNode> = {
    free: <Zap className="w-5 h-5" />,
    starter: <Star className="w-5 h-5" />,
    active: <Rocket className="w-5 h-5" />,
    pro: <Crown className="w-5 h-5" />,
    unlimited: <Crown className="w-5 h-5" />,
  };

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') return;
    if (user?.plan === planId) return;
    setSelectedPlan(planId);
    setShowPayment(true);
  };

  const handlePayment = (_method: string) => {
    if (user && selectedPlan) {
      setUser({ ...user, plan: selectedPlan as any, signalsUsed: 0, signalsTotal: selectedPlan === 'unlimited' ? -1 : plans.find(p => p.id === selectedPlan)?.signals || 0 });
    }
    setShowPayment(false);
    setSelectedPlan(null);
  };

  const categories = [
    { key: 'international', label: '🌍 International' },
    { key: 'pakistan', label: '🇵🇰 Pakistan' },
    { key: 'middle_east', label: '🇦🇪 Middle East' },
    { key: 'south_asia', label: '🇮🇳 South Asia' },
    { key: 'southeast_asia', label: '🇮🇩 SE Asia' },
    { key: 'turkey', label: '🇹🇷 Turkey' },
    { key: 'africa', label: '🌍 Africa' },
    { key: 'latam', label: '🇧🇷 Latin America' },
    { key: 'crypto', label: '₮ Crypto' },
    { key: 'bank', label: '🏦 Bank' },
  ];

  const filteredMethods = paymentMethods.filter(m => m.category === paymentCategory && m.enabled);

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-gray-400 text-sm">All plans include all 4 markets · 40+ assets. Upgrade or cancel anytime.</p>
      </div>

      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 flex items-center gap-3">
        <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-cyan-400">Current Plan: {user?.plan?.charAt(0).toUpperCase()}{user?.plan?.slice(1)}</p>
          <p className="text-xs text-gray-400">Upgrade to unlock more signals and premium features</p>
        </div>
      </div>

      <div className="space-y-3">
        {plans.map(plan => {
          const isCurrent = user?.plan === plan.id;
          return (
            <div key={plan.id} className={`relative rounded-2xl border p-4 transition ${isCurrent ? 'border-cyan-500 bg-cyan-500/5' : plan.highlighted ? 'border-cyan-500/50 bg-cyan-500/5' : plan.badge ? 'border-purple-500/30 bg-purple-500/5' : 'border-gray-800 bg-gray-900/50'}`}>
              {plan.badge && <span className="absolute -top-2 right-4 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">{plan.badge}</span>}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCurrent ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-400'}`}>
                    {planIcons[plan.id]}
                  </div>
                  <div>
                    <h3 className="font-bold">{plan.name}</h3>
                    <p className="text-xs text-gray-500">{plan.signals === -1 ? 'Unlimited signals' : `${plan.signals} signals`} · {plan.validity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                    {plan.price > 0 && <span className="text-xs text-gray-500 font-normal">{plan.period.startsWith('/') ? plan.period : `/${plan.period}`}</span>}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5 mb-4">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => handleSelectPlan(plan.id)} disabled={isCurrent}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition ${isCurrent ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : plan.highlighted ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                {isCurrent ? 'Current Plan' : plan.price === 0 ? 'Downgrade' : 'Choose Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-800 flex-shrink-0">
              <h3 className="font-bold text-lg">Choose Payment Method</h3>
              <p className="text-sm text-gray-400 mt-1">Plan: {plans.find(p => p.id === selectedPlan)?.name} — ${plans.find(p => p.id === selectedPlan)?.price}</p>
            </div>
            {/* Category Tabs */}
            <div className="flex gap-1 px-3 py-2 overflow-x-auto flex-shrink-0 border-b border-gray-800">
              {categories.map(cat => (
                <button key={cat.key} onClick={() => setPaymentCategory(cat.key)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition ${paymentCategory === cat.key ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:bg-gray-800'}`}>
                  {cat.label}
                </button>
              ))}
            </div>
            {/* Methods */}
            <div className="p-3 space-y-2 overflow-y-auto flex-1">
              {filteredMethods.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-4">No payment methods available in this category yet</p>
              ) : (
                filteredMethods.map(method => (
                  <button key={method.id} onClick={() => handlePayment(method.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-cyan-500/30 transition text-left">
                    <span className="text-lg">{method.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{method.label}</p>
                      <p className="text-[10px] text-gray-500">{method.regions.join(', ')}</p>
                    </div>
                    <span className="text-[10px] text-green-400">Active</span>
                  </button>
                ))
              )}
            </div>
            <div className="p-3 border-t border-gray-800 flex-shrink-0">
              <button onClick={() => { setShowPayment(false); setSelectedPlan(null); }} className="w-full py-2.5 rounded-xl bg-gray-800 text-gray-400 font-medium hover:bg-gray-700 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h3 className="font-bold">Feature Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-3 text-gray-400 font-medium">Feature</th>
                {plans.slice(0, 4).map(p => <th key={p.id} className="p-3 text-center text-gray-400 font-medium text-xs">{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ['Signal Requests', '3', '12', '25', '120', '∞'],
                ['All 4 Markets (40+ Assets)', '✓', '✓', '✓', '✓', '✓'],
                ['6-Layer Analysis', '✓', '✓', '✓', '✓', '✓'],
                ['Confidence Score', '✓', '✓', '✓', '✓', '✓'],
                ['Simple Explanation', '✓', '✓', '—', '—', '—'],
                ['Risk View', '—', '✓', '✓', '✓', '✓'],
                ['Signal History', '—', '✓', '✓+', '✓+', '✓+'],
                ['Watchlist Alerts', '—', '—', '✓', '✓', '✓+'],
                ['Multi-Timeframe', '—', '—', '✓', '✓', '✓'],
                ['Advanced Explanation', '—', '—', '—', '✓', '✓'],
                ['Block Allocation', '—', '—', '—', '✓', '✓'],
                ['Priority Signals', '—', '—', '—', '✓', '✓'],
                ['Top Scanner', '—', '—', '—', '—', '✓'],
                ['Advanced Dashboard', '—', '—', '—', '—', '✓'],
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-800/50">
                  <td className="p-3 text-gray-300 text-xs">{row[0]}</td>
                  {row.slice(1, 5).map((cell, j) => (
                    <td key={j} className="p-3 text-center text-xs">{cell === '✓' ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" /> : cell === '—' ? <span className="text-gray-600">—</span> : <span className="font-mono">{cell}</span>}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-xs text-gray-600 pb-4">All plans include all 4 markets with 40+ assets. No hidden fees. Cancel anytime.</p>
    </div>
  );
}
