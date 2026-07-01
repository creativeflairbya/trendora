export type Market = 'crypto' | 'gold' | 'oil' | 'silver';

export type SignalAction = 'buy' | 'sell' | 'wait';

export type MarketStatus = 'favorable' | 'neutral' | 'avoid';

export type RiskLevel = 'low' | 'medium' | 'high';

export type Timeframe = '1m' | '5m' | '10m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  market: Market;
  price: number;
  change24h: number;
  chartData: { time: string; price: number }[];
}

export interface Signal {
  id: string;
  assetId: string;
  assetSymbol: string;
  assetName: string;
  market: Market;
  action: SignalAction;
  confidence: number;
  risk: RiskLevel;
  marketStatus: MarketStatus;
  entryZone: [number, number];
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  setupQuality: number;
  timeframe: Timeframe;
  holdDuration: string;
  explanation: string;
  advancedExplanation?: string;
  similarSetupSuccess: number;
  createdAt: string;
  expiresAt: string;
}

export interface AlternativeAsset {
  assetId: string;
  symbol: string;
  name: string;
  confidence: number;
  action: SignalAction;
  market: Market;
}

export type PlanType = 'free' | 'starter' | 'active' | 'pro' | 'unlimited';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  period: string;
  signals: number;
  validity: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: PlanType;
  signalsUsed: number;
  signalsTotal: number;
  language: string;
  createdAt: string;
  isAdmin: boolean;
  watchlist: string[];
}

export interface WatchlistItem {
  assetId: string;
  symbol: string;
  name: string;
  market: Market;
  price: number;
  change24h: number;
  alertAbove?: number;
  alertBelow?: number;
}

export interface AdminStats {
  totalUsers: number;
  activeSubscribers: number;
  freeUsers: number;
  mrr: number;
  churnRate: number;
  conversionRate: number;
  totalSignalsGenerated: number;
  avgConfidence: number;
}

export interface Notification {
  id: string;
  type: 'signal' | 'alert' | 'system' | 'billing';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  messages: { sender: 'user' | 'admin'; text: string; time: string }[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}
