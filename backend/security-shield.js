const memoryHits = new Map();

export function securityHeaders(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cache-Control', 'no-store');
}

export function rateLimit(req, res, { limit = 80, windowMs = 60_000 } = {}) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const bucket = memoryHits.get(ip) || [];
  const recent = bucket.filter(ts => now - ts < windowMs);
  recent.push(now);
  memoryHits.set(ip, recent);

  if (recent.length > limit) {
    res.writeHead(429, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'rate_limited' }));
    return false;
  }
  return true;
}

export function validateJsonBody(req, maxBytes = 1024 * 1024) {
  const length = Number(req.headers['content-length'] || 0);
  if (length > maxBytes) throw new Error('request_too_large');
}
