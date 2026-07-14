# SignalAnalyst AI Security Shield

The project includes code-level security hardening for the website and backend APIs.

## Frontend / Hosting Headers

Vercel config:

```text
vercel.json
```

Netlify headers:

```text
public/_headers
```

Headers included:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-Frame-Options: SAMEORIGIN`

## Backend Security Middleware

Shared backend shield:

```text
backend/security-shield.js
```

It includes:

- Security headers
- Basic in-memory IP rate limiting
- Request size validation
- API abuse protection

Currently used by:

- `api/v1/analyze-chart.js`
- `api/v1/api-status.js`
- `api/v1/password-reset.js`

## Production Recommendations

For production, also enable:

- Cloudflare WAF
- Bot fight mode / Turnstile CAPTCHA on login/signup
- HTTPS only
- Server-side session auth
- CSRF protection for state-changing endpoints
- Database-backed rate limiting with Redis
- Malware scanning for uploaded chart images
- File type validation for uploads
- Admin 2FA
- Audit logging for every admin action
- Daily backups
- Secret rotation policy

## Upload Safety

Uploaded chart images should be:

- size limited
- MIME validated
- never executed
- scanned if stored
- deleted after analysis unless user chooses to save history
