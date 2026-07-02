import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { adminStats, assets, paymentMethods as allPaymentMethods } from '../data/mockData';
import { Users, DollarSign, Activity, TrendingUp, Shield, Settings, CreditCard, BarChart3, Globe, Search, ChevronRight, ArrowLeft, Zap, Eye, Lock, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

type AdminTab = 'overview' | 'users' | 'signals' | 'ai' | 'content' | 'billing' | 'security' | 'analytics';

const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
  { key: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
  { key: 'signals', label: 'Signals', icon: <Activity className="w-4 h-4" /> },
  { key: 'ai', label: 'AI Config', icon: <Settings className="w-4 h-4" /> },
  { key: 'content', label: 'Content', icon: <Globe className="w-4 h-4" /> },
  { key: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
  { key: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
  { key: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
];

const mockUsers = [
  { id: '1', name: 'Ahmed Khan', email: 'ahmed@example.com', plan: 'pro', signals: 45, country: 'PK', status: 'active' },
  { id: '2', name: 'Sarah Miller', email: 'sarah@example.com', plan: 'unlimited', signals: 234, country: 'US', status: 'active' },
  { id: '3', name: 'Raj Patel', email: 'raj@example.com', plan: 'active', signals: 12, country: 'IN', status: 'active' },
  { id: '4', name: 'Maria Garcia', email: 'maria@example.com', plan: 'starter', signals: 8, country: 'ES', status: 'active' },
  { id: '5', name: 'John Doe', email: 'john@example.com', plan: 'free', signals: 3, country: 'US', status: 'suspended' },
  { id: '6', name: 'Fatima Al-Rashid', email: 'fatima@example.com', plan: 'pro', signals: 89, country: 'AE', status: 'active' },
  { id: '7', name: 'Yuki Tanaka', email: 'yuki@example.com', plan: 'active', signals: 18, country: 'JP', status: 'active' },
  { id: '8', name: 'Hassan Ali', email: 'hassan@example.com', plan: 'starter', signals: 5, country: 'PK', status: 'active' },
  { id: '9', name: 'Amara Okafor', email: 'amara@example.com', plan: 'free', signals: 2, country: 'NG', status: 'active' },
  { id: '10', name: 'Carlos Santos', email: 'carlos@example.com', plan: 'pro', signals: 67, country: 'BR', status: 'active' },
];

export default function AdminDashboard() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchUsers, setSearchUsers] = useState('');

  if (!user?.isAdmin) {
    return (
      <div className="p-4 text-center py-20">
        <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-400">You need admin privileges to access this page.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 px-6 py-2 rounded-xl bg-gray-800 text-white">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:grid md:grid-cols-[240px_1fr] md:gap-6 md:space-y-0 md:py-6">
      <div className="p-4 flex items-center gap-3 md:col-span-2 md:rounded-2xl md:bg-gray-900 md:border md:border-gray-800">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-gray-800 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold">Admin Dashboard</h1>
          <p className="text-xs text-gray-400">Full system control</p>
        </div>
        <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
          <Shield className="w-3 h-3" /> ADMIN
        </div>
      </div>

      <div className="px-4 flex gap-1.5 overflow-x-auto pb-2 md:overflow-visible md:flex-col md:gap-2 md:p-3 md:rounded-2xl md:bg-gray-900 md:border md:border-gray-800 md:self-start">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition md:w-full md:text-left ${activeTab === tab.key ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="px-4 pb-8 md:px-0 md:pb-0">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users' && <UsersTab search={searchUsers} setSearch={setSearchUsers} />}
        {activeTab === 'signals' && <SignalsTab />}
        {activeTab === 'ai' && <AIConfigTab />}
        {activeTab === 'content' && <ContentTab />}
        {activeTab === 'billing' && <BillingTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
      <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mb-2`}>{icon}</div>
      <p className="text-lg font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Users" value={adminStats.totalUsers} icon={<Users className="w-4 h-4 text-cyan-400" />} color="bg-cyan-500/20" />
        <StatCard label="Active Subs" value={adminStats.activeSubscribers} icon={<DollarSign className="w-4 h-4 text-green-400" />} color="bg-green-500/20" />
        <StatCard label="MRR" value={`$${adminStats.mrr.toLocaleString()}`} icon={<TrendingUp className="w-4 h-4 text-purple-400" />} color="bg-purple-500/20" />
        <StatCard label="Free Users" value={adminStats.freeUsers} icon={<Users className="w-4 h-4 text-gray-400" />} color="bg-gray-500/20" />
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
        <h3 className="font-bold text-sm">Key Metrics</h3>
        <div className="space-y-2">
          {[
            { label: 'Conversion Rate', value: '30.3%', color: 'bg-green-500', width: '30.3%' },
            { label: 'Churn Rate', value: '4.2%', color: 'bg-red-500', width: '8.4%' },
            { label: 'Avg Confidence', value: '67.3%', color: 'bg-cyan-500', width: '67.3%' },
          ].map(metric => (
            <div key={metric.label}>
              <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">{metric.label}</span><span className="font-semibold">{metric.value}</span></div>
              <div className="w-full bg-gray-800 rounded-full h-2"><div className={`${metric.color} h-2 rounded-full`} style={{ width: metric.width }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Plan Distribution</h3>
        <div className="space-y-2">
          {[{plan:'Free',count:8956,pct:69.7},{plan:'Starter',count:1243,pct:9.7},{plan:'Active',count:1234,pct:9.6},{plan:'Pro',count:892,pct:6.9},{plan:'Unlimited',count:522,pct:4.1}].map(p=>(
            <div key={p.plan} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-16">{p.plan}</span>
              <div className="flex-1 bg-gray-800 rounded-full h-3"><div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full" style={{width:`${p.pct}%`}} /></div>
              <span className="text-xs text-gray-500 w-20 text-right">{p.count.toLocaleString()} ({p.pct}%)</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div><p className="text-xs text-gray-500">Total Signals Generated</p><p className="text-2xl font-bold">{adminStats.totalSignalsGenerated.toLocaleString()}</p></div>
          <Activity className="w-8 h-8 text-cyan-400/30" />
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">System Health</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[{label:'API',s:'Operational'},{label:'Signal Engine',s:'Running'},{label:'Payment GW',s:'Operational'},{label:'Database',s:'Healthy'}].map(item=>(
            <div key={item.label} className="bg-gray-800/50 rounded-lg p-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <div><p className="text-xs font-medium">{item.label}</p><p className="text-[10px] text-green-400">{item.s}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersTab({ search, setSearch }: { search: string; setSearch: (s: string) => void }) {
  const [users, setUsers] = useState(mockUsers.map((user, index) => ({
    ...user,
    credits: user.plan === 'unlimited' ? -1 : Math.max(0, 120 - index * 9),
    expiresAt: user.plan === 'free' ? 'No expiry' : new Date(Date.now() + (index + 5) * 86400000).toISOString().slice(0, 10),
  })));
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPlan, setNewUserPlan] = useState('free');
  const filtered = search ? users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) : users;
  const updateUser = (id: string, patch: Partial<typeof users[number]>) => setUsers(prev => prev.map(user => user.id === id ? { ...user, ...patch } : user));
  const createUser = () => {
    if (!newUserEmail || !newUserName) return;
    setUsers(prev => [{
      id: `admin-created-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      plan: newUserPlan,
      signals: 0,
      credits: newUserPlan === 'unlimited' ? -1 : newUserPlan === 'pro' ? 120 : newUserPlan === 'active' ? 25 : newUserPlan === 'starter' ? 12 : 3,
      expiresAt: newUserPlan === 'free' ? 'No expiry' : new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      country: 'Manual',
      status: 'active',
    }, ...prev]);
    setNewUserEmail('');
    setNewUserName('');
  };
  return (
    <div className="space-y-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Master User Controls</h3>
        <div className="grid gap-2 md:grid-cols-[1fr_1fr_160px_120px]">
          <input value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="Full name" className="rounded-xl bg-gray-800 border border-gray-700 px-3 py-2 text-sm outline-none focus:border-cyan-500" />
          <input value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} placeholder="email@example.com" className="rounded-xl bg-gray-800 border border-gray-700 px-3 py-2 text-sm outline-none focus:border-cyan-500" />
          <select value={newUserPlan} onChange={e => setNewUserPlan(e.target.value)} className="rounded-xl bg-gray-800 border border-gray-700 px-3 py-2 text-sm outline-none focus:border-cyan-500">
            {['free', 'starter', 'active', 'pro', 'unlimited'].map(plan => <option key={plan} value={plan}>{plan}</option>)}
          </select>
          <button onClick={createUser} className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-bold text-gray-950">Create User</button>
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none" />
      </div>
      <div className="space-y-2">
        {filtered.map(u => (
          <div key={u.id} className="bg-gray-900 border border-gray-800 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold">{u.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><p className="font-semibold text-sm truncate">{u.name}</p><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${u.status==='active'?'bg-green-500/20 text-green-400':'bg-red-500/20 text-red-400'}`}>{u.status}</span></div>
                <p className="text-xs text-gray-500 truncate">{u.email} · 🌍 {u.country}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
            </div>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-6 gap-2">
              <div className="bg-gray-800/50 rounded-lg p-1.5 text-center"><p className="text-[10px] text-gray-500">Plan</p><p className="text-xs font-semibold capitalize">{u.plan}</p></div>
              <div className="bg-gray-800/50 rounded-lg p-1.5 text-center"><p className="text-[10px] text-gray-500">Signals</p><p className="text-xs font-semibold">{u.signals}</p></div>
              <div className="bg-gray-800/50 rounded-lg p-1.5 text-center"><p className="text-[10px] text-gray-500">Credits</p><input type="number" value={u.credits} onChange={e => updateUser(u.id, { credits: Number(e.target.value) })} className="w-full bg-transparent text-center text-xs font-semibold outline-none" /></div>
              <div className="bg-gray-800/50 rounded-lg p-1.5 text-center"><p className="text-[10px] text-gray-500">Expiry</p><input value={u.expiresAt} onChange={e => updateUser(u.id, { expiresAt: e.target.value })} className="w-full bg-transparent text-center text-[10px] font-semibold outline-none" /></div>
              <div className="bg-gray-800/50 rounded-lg p-1.5 text-center"><p className="text-[10px] text-gray-500">Plan</p><select value={u.plan} onChange={e => updateUser(u.id, { plan: e.target.value })} className="w-full bg-transparent text-center text-[10px] font-semibold outline-none"><option>free</option><option>starter</option><option>active</option><option>pro</option><option>unlimited</option></select></div>
              <div className="bg-gray-800/50 rounded-lg p-1.5 text-center"><p className="text-[10px] text-gray-500">Actions</p><div className="flex gap-1 justify-center"><button onClick={() => updateUser(u.id, { credits: u.credits === -1 ? 25 : u.credits + 10 })} className="text-[10px] text-cyan-400">+10</button><button onClick={() => updateUser(u.id, { status: u.status === 'active' ? 'suspended' : 'active' })} className="text-[10px] text-red-400">{u.status === 'active' ? 'Ban' : 'Unban'}</button></div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignalsTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Generated" value="284,920" icon={<Activity className="w-4 h-4 text-cyan-400" />} color="bg-cyan-500/20" />
        <StatCard label="Avg Confidence" value="79.4%" icon={<Zap className="w-4 h-4 text-purple-400" />} color="bg-purple-500/20" />
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Asset Performance</h3>
        <div className="space-y-2">
          {assets.slice(0,8).map(asset => (
            <div key={asset.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/30">
              <span className="text-sm">{asset.market==='crypto'?'₿':asset.market==='gold'?'🥇':asset.market==='oil'?'🛢️':'🥈'}</span>
              <span className="text-sm font-medium flex-1">{asset.symbol}</span>
              <span className="text-xs text-gray-400">{Math.floor(Math.random()*500+100)} sig</span>
              <span className="text-xs text-green-400">{(70+Math.random()*20).toFixed(1)}% acc</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Signal Engine Controls</h3>
        <div className="space-y-3">
          {[{label:'Minimum Confidence Threshold',value:'60%',desc:'Signals below this suppressed'},{label:'Risk Threshold',value:'High',desc:'Max risk level allowed'},{label:'Setup Quality Min',value:'40/100',desc:'Min quality score'},{label:'Alternative Threshold',value:'50%',desc:'Show alternatives below this'}].map(ctrl=>(
            <div key={ctrl.label} className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1"><span className="text-sm font-medium">{ctrl.label}</span><span className="text-sm text-cyan-400 font-mono">{ctrl.value}</span></div>
              <p className="text-[10px] text-gray-500">{ctrl.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIConfigTab() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-2">🧠 6-Layer Hybrid Engine</h3>
        <p className="text-xs text-gray-400">Each layer adds confirmation quality before a signal is allowed through the risk filter.</p>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Engine Layer Weights</h3>
        <div className="space-y-3">
          {[
            { label: 'L1: Market Data Engine', value: '25%', desc: 'Live OHLCV, order book, volume profile', slider: 25 },
            { label: 'L2: Technical Analysis', value: '30%', desc: '30+ indicators computed simultaneously', slider: 30 },
            { label: 'L3: Market Regime Detection', value: '15%', desc: 'Trending/ranging/volatile classification', slider: 15 },
            { label: 'L4: Signal Scoring', value: '15%', desc: 'Multi-factor weighted confidence', slider: 15 },
            { label: 'L5: AI Explanation', value: '10%', desc: 'LLM-powered multilingual synthesis', slider: 10 },
            { label: 'L6: Alternative Engine', value: '5%', desc: 'Cross-asset opportunity ranking', slider: 5 },
          ].map(config => (
            <div key={config.label}>
              <div className="flex justify-between text-xs mb-0.5"><span className="text-gray-300 font-medium">{config.label}</span><span className="text-cyan-400 font-mono">{config.value}</span></div>
              <p className="text-[10px] text-gray-500 mb-1">{config.desc}</p>
              <div className="w-full bg-gray-800 rounded-full h-2"><div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{ width: `${config.slider * 2}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Indicator Sensitivity</h3>
        <div className="space-y-2">
          {['RSI (14)','MACD (12,26,9)','ATR (14)','Bollinger Bands','Ichimoku Cloud','Volume Profile','Stochastic RSI','ADX','OBV','VWAP','Wyckoff Phase','Fibonacci Levels','Pivot Points','Order Flow'].map(ind=>(
            <div key={ind} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
              <span className="text-xs">{ind}</span>
              <select className="bg-gray-700 text-[10px] rounded-lg px-2 py-1 text-gray-300 border border-gray-600"><option>Low</option><option selected>Medium</option><option>High</option></select>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Market Regime Filters</h3>
        <div className="space-y-2">
          {[{r:'Trending Bullish',e:true},{r:'Trending Bearish',e:true},{r:'Ranging',e:true},{r:'Volatile/News',e:false},{r:'Breakout Pending',e:true},{r:'Accumulation',e:true},{r:'Distribution',e:true},{r:'Uncertain',e:false}].map(r=>(
            <div key={r.r} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
              <span className="text-xs">{r.r}</span>
              <div className={`w-10 h-6 rounded-full transition ${r.e?'bg-cyan-500':'bg-gray-600'} relative`}><div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${r.e?'right-1':'left-1'}`} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContentTab() {
  return (
    <div className="space-y-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Content Management</h3>
        <div className="space-y-2">
          {[{label:'Hero Text',value:'AI Signals. Simple Decisions.'},{label:'Subheading',value:'Trendora helps everyday users...'},{label:'Announcement Bar',value:'🔥 6-Layer Engine: 79% avg confidence'},{label:'Promo Banner',value:'Limited: 20% off Pro plan'}].map(item=>(
            <div key={item.label} className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between"><span className="text-sm font-medium">{item.label}</span><button className="text-xs text-cyan-400">Edit</button></div>
              <p className="text-xs text-gray-400 mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Localization Status</h3>
        <div className="space-y-2">
          {[{l:'🇺🇸 English',p:100},{l:'🇵🇰 Urdu',p:95},{l:'🇪🇸 Spanish',p:85},{l:'🇫🇷 French',p:72},{l:'🇸🇦 Arabic',p:68},{l:'🇮🇳 Hindi',p:78},{l:'🇹🇷 Turkish',p:65},{l:'🇧🇷 Portuguese',p:70},{l:'🇮🇩 Indonesian',p:55},{l:'🇮🇷 Farsi',p:48},{l:'🇧🇩 Bengali',p:60}].map(l=>(
            <div key={l.l} className="flex items-center gap-3">
              <span className="text-xs w-24">{l.l}</span>
              <div className="flex-1 bg-gray-800 rounded-full h-2"><div className="bg-cyan-500 h-2 rounded-full" style={{width:`${l.p}%`}} /></div>
              <span className="text-xs text-gray-500">{l.p}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BillingTab() {
  const [payCat, setPayCat] = useState('international');
  const categories = [{key:'international',label:'🌍 International'},{key:'pakistan',label:'🇵🇰 Pakistan'},{key:'middle_east',label:'🇦🇪 Middle East'},{key:'south_asia',label:'🇮🇳 South Asia'},{key:'southeast_asia',label:'🇮🇩 SE Asia'},{key:'turkey',label:'🇹🇷 Turkey'},{key:'africa',label:'🌍 Africa'},{key:'latam',label:'🇧🇷 LatAm'},{key:'crypto',label:'₮ Crypto'},{key:'bank',label:'🏦 Bank'}];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="MRR" value="$155,520" icon={<DollarSign className="w-4 h-4 text-green-400" />} color="bg-green-500/20" />
        <StatCard label="Active Subs" value="3,891" icon={<Users className="w-4 h-4 text-cyan-400" />} color="bg-cyan-500/20" />
      </div>

      {/* Payment Method Configuration */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h3 className="font-bold text-sm mb-1">💳 Payment Method Configuration</h3>
          <p className="text-[10px] text-gray-500">Enable/disable payment methods by region</p>
        </div>
        <div className="flex gap-1 px-3 py-2 overflow-x-auto border-b border-gray-800">
          {categories.map(cat => (
            <button key={cat.key} onClick={() => setPayCat(cat.key)}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition ${payCat === cat.key ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:bg-gray-800'}`}>
              {cat.label}
            </button>
          ))}
        </div>
        <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
          {allPaymentMethods.filter(m => m.category === payCat).map(method => (
            <div key={method.id} className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-3">
              <span className="text-lg">{method.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{method.label}</p>
                <p className="text-[10px] text-gray-500">{method.regions.join(', ')}</p>
              </div>
              <div className={`w-10 h-6 rounded-full transition ${method.enabled ? 'bg-green-500' : 'bg-gray-600'} relative cursor-pointer`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${method.enabled ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Plan Controls</h3>
        <div className="space-y-2">
          {[{l:'Trial Period',v:'3 days'},{l:'Grace Period',v:'2 days'},{l:'Failed Payment Retry',v:'3 attempts'},{l:'Fair-Use Limit (Unlimited)',v:'500/day'},{l:'Refund Window',v:'7 days'},{l:'Coupon System',v:'Active (12 codes)'}].map(item=>(
            <div key={item.l} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
              <span className="text-sm text-gray-400">{item.l}</span><span className="text-sm font-mono">{item.v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Recent Transactions</h3>
        <div className="space-y-2">
          {[{u:'Ahmed K.',a:'$29.99',p:'Pro',m:'JazzCash',s:'success'},{u:'Sarah M.',a:'$39.99',p:'Unlimited',m:'Apple Pay',s:'success'},{u:'Raj P.',a:'$9.99',p:'Active',m:'UPI',s:'success'},{u:'Maria G.',a:'$2.99',p:'Starter',m:'PayPal',s:'success'},{u:'Hassan A.',a:'$29.99',p:'Pro',m:'Easypaisa',s:'pending'},{u:'Amara O.',a:'$9.99',p:'Active',m:'Flutterwave',s:'success'},{u:'Carlos S.',a:'$39.99',p:'Unlimited',m:'Pix',s:'success'},{u:'John D.',a:'$29.99',p:'Pro',m:'Visa',s:'failed'}].map((tx,i)=>(
            <div key={i} className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.s==='success'?'bg-green-500/20':tx.s==='pending'?'bg-amber-500/20':'bg-red-500/20'}`}>
                {tx.s==='success'?<CheckCircle className="w-4 h-4 text-green-400"/>:tx.s==='pending'?<Clock className="w-4 h-4 text-amber-400"/>:<XCircle className="w-4 h-4 text-red-400"/>}
              </div>
              <div className="flex-1"><p className="text-sm font-medium">{tx.u} · {tx.p}</p><p className="text-xs text-gray-500">{tx.m}</p></div>
              <div className="text-right"><p className="text-sm font-bold">{tx.a}</p><p className={`text-[10px] capitalize ${tx.s==='success'?'text-green-400':tx.s==='pending'?'text-amber-400':'text-red-400'}`}>{tx.s}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-green-400" /> Security Status</h3>
        <div className="grid grid-cols-2 gap-2">
          {[{l:'WAF Protection',s:'Active'},{l:'Rate Limiting',s:'Enabled'},{l:'CSRF Protection',s:'Active'},{l:'XSS Protection',s:'Active'},{l:'SQLi Guard',s:'Active'},{l:'Bot Protection',s:'Active'},{l:'Brute Force Guard',s:'Enabled'},{l:'Secure Headers',s:'Active'},{l:'TLS 1.3',s:'Active'},{l:'2FA (Admin)',s:'Required'}].map(item=>(
            <div key={item.l} className="bg-gray-800/50 rounded-lg p-2 flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-400"/><div><p className="text-[10px] font-medium">{item.l}</p><p className="text-[9px] text-green-400">{item.s}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Lock className="w-4 h-4 text-amber-400" /> Recent Events</h3>
        <div className="space-y-2">
          {[{e:'Suspicious login from new IP',sev:'warning',t:'2 min ago'},{e:'Rate limit on /api/signals',sev:'info',t:'15 min ago'},{e:'Failed admin 2FA attempt',sev:'danger',t:'1h ago'},{e:'Account locked: 5 failed attempts',sev:'warning',t:'3h ago'}].map((ev,i)=>(
            <div key={i} className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-3">
              <AlertTriangle className={`w-4 h-4 ${ev.sev==='danger'?'text-red-400':ev.sev==='warning'?'text-amber-400':'text-blue-400'}`}/>
              <div className="flex-1"><p className="text-xs font-medium">{ev.e}</p><p className="text-[10px] text-gray-500">{ev.t}</p></div>
              <button className="text-[10px] text-cyan-400">Review</button>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Audit Log</h3>
        <div className="space-y-1 text-xs">
          {[{a:'Updated payment method config',b:'admin@trendora.com',t:'5 min ago'},{a:'User suspended: john@example.com',b:'admin@trendora.com',t:'30 min ago'},{a:'Signal threshold updated to 60%',b:'admin@trendora.com',t:'1h ago'},{a:'Easypaisa gateway enabled',b:'admin@trendora.com',t:'2h ago'},{a:'Coupon SAVE20 created',b:'admin@trendora.com',t:'3h ago'}].map((log,i)=>(
            <div key={i} className="flex items-center gap-2 p-2 rounded bg-gray-800/30">
              <Eye className="w-3 h-3 text-gray-500"/><span className="text-gray-300 flex-1">{log.a}</span><span className="text-gray-600">{log.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Funnel Tracking</h3>
        <div className="space-y-2">
          {[{s:'Visitors',c:45230,p:100},{s:'Signups',c:12847,p:28.4},{s:'First Signal',c:8920,p:19.7},{s:'Free to Paid',c:3891,p:8.6},{s:'Active (30d)',c:2340,p:5.2}].map(f=>(
            <div key={f.s}>
              <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">{f.s}</span><span>{f.c.toLocaleString()} ({f.p}%)</span></div>
              <div className="w-full bg-gray-800 rounded-full h-2.5"><div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full" style={{width:`${f.p}%`}} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Revenue by Market</h3>
        <div className="space-y-2">
          {[{m:'Crypto',r:'$82,340',s:156720},{m:'Gold (XAU)',r:'$38,920',s:67890},{m:'Oil & Energy',r:'$21,450',s:34230},{m:'Silver (XAG)',r:'$12,810',s:26080}].map(m=>(
            <div key={m.m} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
              <div><p className="text-sm font-medium">{m.m}</p><p className="text-xs text-gray-500">{m.s.toLocaleString()} signals</p></div>
              <span className="text-sm font-bold text-green-400">{m.r}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Top Retention</h3>
        <div className="space-y-2">
          {[{s:'Pro Traders (30d+)',r:'92%'},{s:'Unlimited Users',r:'88%'},{s:'Watchlist Users',r:'76%'},{s:'Multi-market Users',r:'71%'},{s:'Free (no signal)',r:'23%'}].map(s=>(
            <div key={s.s} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
              <span className="text-sm">{s.s}</span><span className="text-sm font-bold text-cyan-400">{s.r}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-3">Signal Quality Stack</h3>
        <div className="space-y-2">
          {[{f:'Analysis Method',us:'6-Layer Real-time',them:'Required'},{f:'Indicators',us:'30+ Simultaneous',them:'Enabled'},{f:'Market Regime',us:'Detected',them:'Enabled'},{f:'Alternatives',us:'Cross-asset',them:'Enabled'},{f:'Live Data',us:'Exchange candles',them:'Enabled'},{f:'Multi-Timeframe',us:'8 TFs',them:'Enabled'},{f:'Signal Filter',us:'Confidence + risk gate',them:'Enabled'},{f:'Languages',us:'13 languages',them:'Enabled'}].map(c=>(
            <div key={c.f} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
              <span className="text-xs text-gray-400">{c.f}</span>
              <div className="text-right"><span className="text-xs text-cyan-400">{c.us}</span><span className="text-[10px] text-gray-600 ml-2">{c.them}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
