# Deploy SignalAnalyst AI On Your Own Server

## Option 1: Static Hosting Only

Use this if you only want the frontend and demo/localStorage features.

```bash
npm install
npm run build
```

Upload the contents of:

```text
dist/
```

to your hosting public directory, usually:

```text
public_html/
```

For Apache/cPanel, add this `.htaccess` inside `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>
```

## Option 2: Full App With Backend APIs

Use VPS/cloud server if you need:

- Gemini chart image analyzer
- password reset email
- Binance signal API
- API status in admin
- future database persistence

Recommended server:

- Hostinger VPS
- DigitalOcean
- Hetzner
- AWS Lightsail
- Render/Railway/Fly.io

Shared SiteGround/Hostinger web hosting may not support Node APIs properly.

## Environment Variables

Set these on your server:

```bash
GEMINI_API_KEY=your_rotated_key
SMTP_HOST=smtp.yourhost.com
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASSWORD=your_password
EMAIL_FROM=your_email@domain.com
STRIPE_SECRET_KEY=optional
PAYPAL_CLIENT_SECRET=optional
JAZZCASH_MERCHANT_ID=optional
EASYPAISA_MERCHANT_ID=optional
```

## Run Backend APIs

Gemini analyzer:

```bash
node backend/gemini-chart-analyzer.js
```

Binance signal API:

```bash
node backend/binance-signal-api.js
```

Live data engine, optional:

```bash
node backend/live-data-engine.js
```

Use PM2 for production:

```bash
npm install -g pm2
pm2 start backend/gemini-chart-analyzer.js --name gemini-analyzer
pm2 start backend/binance-signal-api.js --name signal-api
pm2 save
pm2 startup
```

## Frontend API Endpoint Setup

If backend is on another domain, set in browser or build into config later:

```js
localStorage.setItem('signalanalyst_gemini_endpoint', 'https://api.yourdomain.com/api/v1/analyze-chart')
```

## Master Login

```text
Email: admin@signalanalyst.ai
Password: SignalAnalyst2024!
```

Owner alias also works:

```text
Email: admin@chartanalyst.ai
Password: SignalAnalyst2024!
```

Legacy master still works:

```text
Email: admin@trendora.com
Password: Trendora2024!
```
