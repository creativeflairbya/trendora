import { useNavigate } from 'react-router-dom';
import { Zap, BarChart3, Shield, Globe, ChevronRight, Star, TrendingUp, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { plans, faqs } from '../data/mockData';
import { useState } from 'react';
import AIChartImageAnalyzer from '../components/AIChartImageAnalyzer';

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Market data is inlined below

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/90 backdrop-blur-lg border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Trendora</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-sm text-gray-300 hover:text-white transition px-3 py-2">Log In</button>
            <button onClick={() => navigate('/signup')} className="text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition">Get Started Free</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" />
        <div className="absolute top-32 left-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute top-48 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 text-sm font-medium">Live AI-Powered Signals</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">
            AI Signals.<br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Simple Decisions.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Trendora uses a 6-layer hybrid engine to analyze crypto, gold, oil, and silver with 30+ indicators, live market data, and confidence-based AI signals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button onClick={() => navigate('/signup')} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25">
              Start Free — 3 Signals · 6-Layer Engine <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gray-800 text-gray-300 font-semibold text-lg hover:bg-gray-700 transition">
              See How It Works
            </button>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> No credit card needed</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> All 4 markets</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Beginner friendly</span>
          </div>
        </div>
      </section>

      {/* Markets Strip */}
      <section className="py-12 px-4 border-y border-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-gray-500 mb-6 uppercase tracking-wider font-semibold">40+ Assets Across 4 Markets</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '₿', name: 'Crypto', count: '25+' },
              { icon: '🥇', name: 'Gold', count: '4' },
              { icon: '🛢️', name: 'Oil & Energy', count: '6' },
              { icon: '🥈', name: 'Silver', count: '3' },
            ].map(item => (
              <div key={item.name} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/30 transition">
                <span className="text-3xl">{item.icon}</span>
                <span className="font-semibold">{item.name}</span>
                <span className="text-xs text-cyan-400">{item.count} assets</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400">From landing to profit — in 4 simple steps</p>
          </div>
          <div className="space-y-6">
            {[
              { step: '1', title: 'Sign Up Free', desc: 'Create your account and get 3 free AI signal credits instantly', icon: <Zap className="w-6 h-6" /> },
              { step: '2', title: 'Choose Your Market', desc: 'Select from Crypto, Gold, Oil, or Silver — all markets included', icon: <BarChart3 className="w-6 h-6" /> },
              { step: '3', title: 'Get AI Signal', desc: 'Our hybrid engine analyzes technicals, regime, and risk — then gives you a clear signal', icon: <TrendingUp className="w-6 h-6" /> },
              { step: '4', title: 'Trade with Confidence', desc: 'See confidence scores, risk levels, and entry/exit zones — or get safer alternatives', icon: <Shield className="w-6 h-6" /> },
            ].map(item => (
              <div key={item.step} className="flex items-start gap-4 p-5 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/30 transition">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">STEP {item.step}</span>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signal Preview */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">See What a Signal Looks Like</h2>
            <p className="text-gray-400">Real analysis, real confidence scores, real alternatives</p>
          </div>
          <div className="space-y-4">
            <AIChartImageAnalyzer compact onAnalyze={() => {}} />
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-cyan-400">99%</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-green-400">92%</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Risk Level</p>
                  <p className="text-2xl font-bold text-amber-400">Med</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Entry Zone</span><span className="font-mono">Live chart price zone</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Stop Loss</span><span className="font-mono text-red-400">Dynamic by hold time</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Take Profit 1</span><span className="font-mono text-green-400">Dynamic target</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Take Profit 2</span><span className="font-mono text-green-400">Macro target</span></div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">AI Explanation</p>
                <p className="text-sm text-gray-300">Trendora uses the selected live market chart, holding period, candle confirmation, volatility, and risk filters before showing the signal.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Trendora */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Trendora is Different</h2>
          <p className="text-gray-400">Live data, disciplined signal filters, and clear risk scoring.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '🧠', title: '6-Layer Hybrid Engine', desc: 'Market data + 30+ indicators + regime detection + signal scoring + AI synthesis + alternatives — all running simultaneously.' },
              { icon: '🛡️', title: 'Says "No Signal" When Needed', desc: 'We tell you when to wait. That restraint improves trust and your outcomes — unlike tools that force signals.' },
              { icon: '📊', title: 'Real-Time Market View', desc: 'Analyze live-style candles across 40+ assets with multiple timeframes and hold settings.' },
              { icon: '🔄', title: 'Safer Alternatives', desc: 'No strong setup? Our L6 engine suggests better opportunities across all markets with confidence scores.' },
              { icon: '🌐', title: '13 Languages + Local Payments', desc: 'Use Trendora in your language. Pay with Easypaisa, JazzCash, UPI, Pix, Binance Pay, and 25+ methods.' },
              { icon: '🔒', title: 'Security-First + Honest', desc: 'Encrypted, monitored, hardened. Three separate accuracy metrics — not fake "99%" claims.' },
            ].map(item => (
              <div key={item.title} className="p-5 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/30 transition">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Honest Pricing</h2>
            <p className="text-gray-400">Start free. Upgrade when you're ready. Cancel anytime.</p>
          </div>
          <div className="space-y-4">
            {plans.map(plan => (
              <div key={plan.id} className={`relative p-5 rounded-2xl border transition ${plan.highlighted ? 'border-cyan-500 bg-cyan-500/5' : plan.badge ? 'border-purple-500/50 bg-purple-500/5' : 'border-gray-800 bg-gray-900/50'}`}>
                {plan.badge && <span className="absolute -top-2.5 right-4 text-xs font-bold px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">{plan.badge}</span>}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className="text-sm text-gray-400">{plan.signals === -1 ? 'Unlimited signals' : `${plan.signals} signals`} · {plan.validity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                      {plan.price > 0 && <span className="text-sm text-gray-500 font-normal">{plan.period.startsWith('/') ? plan.period : ''}</span>}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {plan.features.slice(0, 4).map(f => (
                    <span key={f} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-lg flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" /> {f}
                    </span>
                  ))}
                </div>
                <button onClick={() => navigate('/signup')} className={`w-full mt-4 py-2.5 rounded-xl font-semibold text-sm transition ${plan.highlighted ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                  {plan.price === 0 ? 'Get Started Free' : 'Choose Plan'}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-600 mt-6">All plans include all 4 markets. No hidden fees. Cancel anytime.</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Trusted by Traders Worldwide</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'Ahmed K.', role: 'Crypto Trader', text: 'Finally a signal app that says "no signal" instead of forcing bad trades. My win rate improved significantly.', stars: 5 },
              { name: 'Sarah M.', role: 'Gold Investor', text: 'The confidence scores and alternatives feature is a game-changer for my market planning.', stars: 5 },
              { name: 'Raj P.', role: 'Beginner Trader', text: 'As a beginner, the simple explanations and learning section helped me understand what I was actually doing.', stars: 5 },
            ].map(t => (
              <div key={t.name} className="p-5 rounded-2xl bg-gray-900/50 border border-gray-800">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-300 text-sm mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
              <Lock className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Security-First Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built to Be Trusted</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Encrypted Connections', desc: 'All data transmitted over HTTPS with TLS 1.3 encryption' },
              { title: 'Secure Authentication', desc: 'Verified sessions, 2FA for admins, brute-force protection' },
              { title: 'No Raw Card Data', desc: 'Payments processed through trusted gateways — we never store card details' },
              { title: 'Audit & Monitoring', desc: 'Admin action logs, IP monitoring, suspicious activity detection' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-bold text-lg mb-4">Accepted Payment Methods</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['💳 Visa/MC', '🍎 Apple Pay', '📱 Google Pay', '🅿️ PayPal', '📲 Easypaisa', '📲 JazzCash', '📱 UPI', '💳 Razorpay', '💳 PayTabs', '💳 Flutterwave', '📱 Pix', '₮ USDT', '🅱️ Binance Pay', '🏦 Bank Transfer'].map(m => (
              <span key={m} className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-300">{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(faq => (
              <div key={faq.id} className="rounded-2xl bg-gray-900/50 border border-gray-800 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)} className="w-full flex items-center justify-between p-4 text-left">
                  <span className="font-semibold text-sm pr-4">{faq.question}</span>
                  <ChevronRight className={`w-5 h-5 text-gray-500 flex-shrink-0 transition ${openFaq === faq.id ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === faq.id && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-400 text-sm">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready for Better Signals?</h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">Join thousands of traders who trust Trendora for honest, confidence-based AI signals across crypto, gold, oil, and silver.</p>
              <button onClick={() => navigate('/signup')} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:opacity-90 transition inline-flex items-center gap-2 shadow-lg shadow-cyan-500/25">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-gray-600 mt-4">3 free signals · No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Trendora</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">Available Worldwide</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
            <div>
              <p className="font-semibold text-sm mb-3">Product</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="hover:text-gray-300 cursor-pointer">Features</p>
                <p className="hover:text-gray-300 cursor-pointer">Pricing</p>
                <p className="hover:text-gray-300 cursor-pointer">Markets</p>
                <p className="hover:text-gray-300 cursor-pointer">API</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Company</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="hover:text-gray-300 cursor-pointer">About</p>
                <p className="hover:text-gray-300 cursor-pointer">Blog</p>
                <p className="hover:text-gray-300 cursor-pointer">Careers</p>
                <p className="hover:text-gray-300 cursor-pointer">Contact</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Support</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="hover:text-gray-300 cursor-pointer">Help Center</p>
                <p className="hover:text-gray-300 cursor-pointer">FAQ</p>
                <p className="hover:text-gray-300 cursor-pointer">Status</p>
                <p className="hover:text-gray-300 cursor-pointer">Tickets</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Legal</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="hover:text-gray-300 cursor-pointer">Privacy</p>
                <p className="hover:text-gray-300 cursor-pointer">Terms</p>
                <p className="hover:text-gray-300 cursor-pointer">Risk Disclosure</p>
                <p className="hover:text-gray-300 cursor-pointer">Cookie Policy</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">© 2024 Trendora. All rights reserved.</p>
            <p className="text-xs text-gray-600">⚠️ Trading involves risk. Signals are for informational purposes only. Not financial advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
