import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { rateLimit, securityHeaders, validateJsonBody } from '../../backend/security-shield.js';

function json(res, status, data) {
  res.status(status).json(data);
}

function buildResetUrl(req, token) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  return `${proto}://${host}/login?resetToken=${encodeURIComponent(token)}`;
}

async function sendResetEmail({ to, resetUrl }) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.EMAIL_FROM || user;

  if (!host || !user || !pass || !from) {
    return { sent: false, reason: 'smtp_not_configured', resetUrl };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject: 'SignalAnalyst AI password reset',
    html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Click here to reset your password</a></p><p>This link is valid for 30 minutes.</p>`,
    text: `Reset your password: ${resetUrl}`,
  });
  return { sent: true };
}

export default async function handler(req, res) {
  securityHeaders(req, res);
  if (!rateLimit(req, res, { limit: 10, windowMs: 60_000 })) return;
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });

  try {
    validateJsonBody(req, 64 * 1024);
    const { email } = req.body || {};
    if (!email || !String(email).includes('@')) return json(res, 400, { error: 'valid_email_required' });

    const token = crypto.randomBytes(24).toString('hex');
    const resetUrl = buildResetUrl(req, token);
    const mail = await sendResetEmail({ to: email, resetUrl });

    return json(res, 200, { ok: true, message: mail.sent ? 'reset_email_sent' : 'reset_link_generated_smtp_missing', emailSent: mail.sent, resetUrl: mail.sent ? undefined : resetUrl });
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
}
