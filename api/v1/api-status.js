import { rateLimit, securityHeaders } from '../../backend/security-shield.js';

export default function handler(req, res) {
  securityHeaders(req, res);
  if (!rateLimit(req, res, { limit: 60, windowMs: 60_000 })) return;
  const now = new Date().toISOString();
  res.status(200).json({
    checkedAt: now,
    services: [
      { name: 'Gemini Vision', key: 'GEMINI_API_KEY', configured: Boolean(process.env.GEMINI_API_KEY), status: process.env.GEMINI_API_KEY ? 'configured' : 'missing', expires: 'Managed in Google AI Studio' },
      { name: 'Binance Public API', key: 'none', configured: true, status: 'public', expires: 'No API key required' },
      { name: 'Stripe', key: 'STRIPE_SECRET_KEY', configured: Boolean(process.env.STRIPE_SECRET_KEY), status: process.env.STRIPE_SECRET_KEY ? 'configured' : 'missing', expires: 'Dashboard managed' },
      { name: 'PayPal', key: 'PAYPAL_CLIENT_SECRET', configured: Boolean(process.env.PAYPAL_CLIENT_SECRET), status: process.env.PAYPAL_CLIENT_SECRET ? 'configured' : 'missing', expires: 'Dashboard managed' },
      { name: 'JazzCash', key: 'JAZZCASH_MERCHANT_ID', configured: Boolean(process.env.JAZZCASH_MERCHANT_ID), status: process.env.JAZZCASH_MERCHANT_ID ? 'configured' : 'missing', expires: 'Merchant portal managed' },
      { name: 'Easypaisa', key: 'EASYPAISA_MERCHANT_ID', configured: Boolean(process.env.EASYPAISA_MERCHANT_ID), status: process.env.EASYPAISA_MERCHANT_ID ? 'configured' : 'missing', expires: 'Merchant portal managed' },
    ],
  });
}
