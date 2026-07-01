# Trendora — Database Schema & Backend Deployment Guide

This document provides the complete database schema and backend configuration needed to deploy Trendora on your own server.

---

## 🗄️ Recommended Stack

| Component | Recommended | Alternative |
|-----------|------------|-------------|
| **Database** | PostgreSQL 16+ | MySQL 8+, MongoDB |
| **Backend** | Node.js + Express | Python FastAPI, Go |
| **Cache** | Redis 7+ | Memcached |
| **Queue** | Bull/BullMQ | RabbitMQ, Celery |
| **ORM** | Prisma | TypeORM, Sequelize |
| **Auth** | JWT + bcrypt | Passport.js |
| **Payments** | Stripe + Custom | Paddle, LemonSqueezy |
| **Deployment** | Docker + Nginx | PM2, Kubernetes |

---

## 📊 Complete Database Schema (PostgreSQL)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free','starter','active','pro','unlimited')),
  signals_used INTEGER DEFAULT 0,
  signals_total INTEGER DEFAULT 3,
  language VARCHAR(5) DEFAULT 'en',
  is_admin BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_suspended BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP,
  login_ip VARCHAR(45),
  login_device VARCHAR(255),
  watchlist TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_plan ON users(plan);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','cancelled','expired','grace_period','past_due')),
  started_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  cancelled_at TIMESTAMP,
  auto_renew BOOLEAN DEFAULT TRUE,
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_subs_user ON subscriptions(user_id);
CREATE INDEX idx_subs_status ON subscriptions(status);
```

### Signals Table
```sql
CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id VARCHAR(50) NOT NULL,
  asset_symbol VARCHAR(20) NOT NULL,
  asset_name VARCHAR(100) NOT NULL,
  market VARCHAR(20) NOT NULL CHECK (market IN ('crypto','gold','oil','silver')),
  action VARCHAR(10) NOT NULL CHECK (action IN ('buy','sell','wait')),
  confidence INTEGER NOT NULL CHECK (confidence BETWEEN 0 AND 100),
  risk VARCHAR(10) NOT NULL CHECK (risk IN ('low','medium','high')),
  market_status VARCHAR(10) NOT NULL CHECK (market_status IN ('favorable','neutral','avoid')),
  entry_zone_low DECIMAL(20,8),
  entry_zone_high DECIMAL(20,8),
  stop_loss DECIMAL(20,8),
  take_profit_1 DECIMAL(20,8),
  take_profit_2 DECIMAL(20,8),
  setup_quality INTEGER CHECK (setup_quality BETWEEN 0 AND 100),
  timeframe VARCHAR(5) NOT NULL,
  explanation TEXT NOT NULL,
  advanced_explanation TEXT,
  similar_setup_success INTEGER CHECK (similar_setup_success BETWEEN 0 AND 100),
  wyckoff_phase VARCHAR(20),
  market_regime VARCHAR(30),
  volume_profile JSONB,
  indicator_data JSONB,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_signals_asset ON signals(asset_id);
CREATE INDEX idx_signals_market ON signals(market);
CREATE INDEX idx_signals_confidence ON signals(confidence DESC);
CREATE INDEX idx_signals_created ON signals(created_at DESC);
```

### Signal Requests (User History)
```sql
CREATE TABLE signal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  signal_id UUID REFERENCES signals(id),
  asset_id VARCHAR(50) NOT NULL,
  plan_at_request VARCHAR(20) NOT NULL,
  credits_before INTEGER,
  credits_after INTEGER,
  result VARCHAR(20) CHECK (result IN ('signal_generated','no_signal','alternative_suggested','insufficient_credits')),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_sigreq_user ON signal_requests(user_id);
CREATE INDEX idx_sigreq_created ON signal_requests(created_at DESC);
```

### Assets Table
```sql
CREATE TABLE assets (
  id VARCHAR(50) PRIMARY KEY,
  symbol VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  market VARCHAR(20) NOT NULL CHECK (market IN ('crypto','gold','oil','silver')),
  is_active BOOLEAN DEFAULT TRUE,
  coingecko_id VARCHAR(100),
  tradingview_symbol VARCHAR(100),
  min_confidence_threshold INTEGER DEFAULT 45,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Asset Prices (Live Cache)
```sql
CREATE TABLE asset_prices (
  asset_id VARCHAR(50) REFERENCES assets(id) ON DELETE CASCADE,
  price DECIMAL(20,8) NOT NULL,
  change_24h DECIMAL(10,4),
  high_24h DECIMAL(20,8),
  low_24h DECIMAL(20,8),
  volume_24h BIGINT,
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (asset_id)
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  plan VARCHAR(20) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_gateway VARCHAR(50) NOT NULL,
  gateway_transaction_id VARCHAR(255),
  gateway_webhook_data JSONB,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded','disputed')),
  region VARCHAR(5),
  country VARCHAR(3),
  refund_reason TEXT,
  refund_amount DECIMAL(10,2),
  tax_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_gateway ON payments(payment_gateway);
```

### Payment Methods Config
```sql
CREATE TABLE payment_methods (
  id VARCHAR(50) PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  icon VARCHAR(10),
  category VARCHAR(30) NOT NULL,
  regions TEXT[] NOT NULL DEFAULT '{}',
  enabled BOOLEAN DEFAULT TRUE,
  gateway_config JSONB,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Coupons
```sql
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(30) UNIQUE NOT NULL,
  discount_type VARCHAR(10) CHECK (discount_type IN ('percentage','fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  applicable_plans TEXT[] DEFAULT '{}',
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Watchlist Alerts
```sql
CREATE TABLE watchlist_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  asset_id VARCHAR(50) NOT NULL,
  alert_type VARCHAR(20) CHECK (alert_type IN ('price_above','price_below','confidence_above','signal_generated')),
  threshold_value DECIMAL(20,8),
  is_triggered BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_wlalerts_user ON watchlist_alerts(user_id);
```

### Notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('signal','alert','system','billing','promotional')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_notif_user ON notifications(user_id, is_read);
```

### Admin Audit Log
```sql
CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(255),
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_audit_admin ON admin_audit_log(admin_id);
CREATE INDEX idx_audit_created ON admin_audit_log(created_at DESC);
```

### Login History
```sql
CREATE TABLE login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ip_address VARCHAR(45),
  device VARCHAR(255),
  browser VARCHAR(100),
  country VARCHAR(3),
  is_suspicious BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_login_user ON login_history(user_id);
```

### Support Tickets
```sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
  category VARCHAR(30),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  assigned_admin_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_type VARCHAR(10) CHECK (sender_type IN ('user','admin')),
  sender_id UUID,
  message TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Content Management
```sql
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  language VARCHAR(5) DEFAULT 'en',
  type VARCHAR(20) CHECK (type IN ('text','html','json','markdown')),
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Localization
```sql
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code VARCHAR(5) NOT NULL,
  key VARCHAR(255) NOT NULL,
  value TEXT NOT NULL,
  is_rtl BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(language_code, key)
);
```

### Signal Performance Tracking
```sql
CREATE TABLE signal_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES signals(id),
  asset_id VARCHAR(50) NOT NULL,
  entry_price DECIMAL(20,8),
  exit_price DECIMAL(20,8),
  hit_take_profit_1 BOOLEAN DEFAULT FALSE,
  hit_take_profit_2 BOOLEAN DEFAULT FALSE,
  hit_stop_loss BOOLEAN DEFAULT FALSE,
  max_favorable DECIMAL(10,4),
  max_adverse DECIMAL(10,4),
  outcome VARCHAR(10) CHECK (outcome IN ('win','loss','breakeven','expired')),
  pnl_percentage DECIMAL(10,4),
  evaluated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_sigperf_asset ON signal_performance(asset_id);
```

---

## 🔐 Environment Variables (.env)

```env
# Database
DATABASE_URL=postgresql://trendora:password@localhost:5432/trendora
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRY=7d
BCRYPT_SALT_ROUNDS=12

# Stripe (International Payments)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# PayPal
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
PAYPAL_WEBHOOK_ID=xxx

# Regional Payments - Pakistan
EASYPAISA_MERCHANT_ID=xxx
EASYPAISA_API_KEY=xxx
JAZZCASH_MERCHANT_ID=xxx
JAZZCASH_PASSWORD=xxx
JAZZCASH_INTEGRITY_SALT=xxx

# Regional Payments - Middle East
PAYTABS_SERVER_KEY=xxx
PAYTABS_PROFILE_ID=xxx
PAYMOB_API_KEY=xxx

# Regional Payments - India
RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx

# Regional Payments - Africa
FLUTTERWAVE_SECRET_KEY=xxx
PAYSTACK_SECRET_KEY=xxx

# Regional Payments - Latin America
MERCADOPAGO_ACCESS_TOKEN=xxx

# Regional Payments - Turkey
IYZICO_API_KEY=xxx
IYZICO_SECRET_KEY=xxx

# Crypto Payments
BINANCE_PAY_MERCHANT_ID=xxx
USDT_WALLET_TRC20=xxx
USDT_WALLET_ERC20=xxx

# Market Data APIs
COINGECKO_API_KEY=xxx
BINANCE_API_KEY=xxx
BINANCE_API_SECRET=xxx
ALPHA_VANTAGE_API_KEY=xxx
TWELVE_DATA_API_KEY=xxx

# AI / LLM
OPENAI_API_KEY=xxx
ANTHROPIC_API_KEY=xxx
AI_MODEL=gpt-4-turbo

# Admin
ADMIN_EMAIL=admin@trendora.com
ADMIN_PASSWORD_HASH=xxx

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=xxx
SMTP_PASSWORD=xxx
EMAIL_FROM=noreply@trendora.com

# Security
WAF_ENABLED=true
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
CSRF_SECRET=xxx
ENCRYPTION_KEY=xxx

# General
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://trendora.com
APP_URL=https://trendora.com
```

---

## 🏗️ Docker Deployment

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://trendora:password@db:5432/trendora
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: always

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: trendora
      POSTGRES_USER: trendora
      POSTGRES_PASSWORD: password
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: always

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: always

volumes:
  pgdata:
```

---

## 🔑 Master Account Setup

```sql
-- Insert master admin account
INSERT INTO users (email, password_hash, name, plan, is_admin, is_verified, signals_total)
VALUES (
  'admin@trendora.com',
  '$2b$12$HASHED_PASSWORD_HERE',
  'Trendora Admin',
  'unlimited',
  true,
  true,
  -1
);
```

Password: `Trendora2024!` (hash it with bcrypt before inserting)

---

## 📊 Signal Engine Architecture

The 6-layer engine that makes Trendora superior:

1. **Market Data Engine** — Collects live OHLCV from Binance, CoinGecko, Alpha Vantage, Twelve Data
2. **Technical Analysis Engine** — Computes 30+ indicators simultaneously (RSI, MACD, ATR, BB, Ichimoku, ADX, Stochastic, OBV, VWAP, Fibonacci, Pivots)
3. **Market Regime Engine** — Classifies market as Trending/Ranging/Volatile/Breakout/Accumulation/Distribution
4. **Signal Scoring Engine** — Multi-factor weighted scoring (trend alignment, confirmation quality, volume, pattern reliability, R:R ratio)
5. **AI Explanation Engine** — LLM synthesizes all layers into clear, multilingual explanations
6. **Alternative Opportunity Engine** — Ranks all assets by confidence when selected asset has no setup

---

## 🚀 Quick Start

```bash
# 1. Clone and setup
git clone your-repo
cd trendora-backend
npm install

# 2. Setup database
npx prisma migrate dev
npx prisma generate

# 3. Seed admin account
npm run seed

# 4. Start development
npm run dev

# 5. Production with Docker
docker-compose up -d
```

---

This schema supports the complete feature set described in the frontend including all payment methods, admin controls, signal tracking, and the 6-layer analysis engine.
