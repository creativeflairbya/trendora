import http from 'node:http';
import Busboy from 'busboy';

const PORT = Number(process.env.GEMINI_ANALYZER_PORT || 8791);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function json(res, status, data) {
  res.writeHead(status, {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'POST,OPTIONS,GET',
    'access-control-allow-headers': 'content-type',
  });
  res.end(JSON.stringify(data));
}

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: req.headers });
    const fields = {};
    let image = null;

    busboy.on('field', (name, value) => { fields[name] = value; });
    busboy.on('file', (_name, file, info) => {
      const chunks = [];
      file.on('data', chunk => chunks.push(chunk));
      file.on('end', () => {
        image = { buffer: Buffer.concat(chunks), mimeType: info.mimeType || 'image/png' };
      });
    });
    busboy.on('error', reject);
    busboy.on('finish', () => resolve({ fields, image }));
    req.pipe(busboy);
  });
}

function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Gemini did not return JSON');
  return JSON.parse(match[0]);
}

async function analyzeWithGemini(image, fields) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not configured');

  const prompt = `
You are SignalAnalyst AI, a professional futures chart image analyst.
Read the uploaded chart screenshot carefully. Detect the exact market symbol, timeframe, current/close/last price, likely trade direction, risk, setup quality, and reason.

Important rules:
- If the chart says ETHUSDT, return ETH/USDT, never XAU.
- Use the visible C/Close/Last price from the chart, not MA/EMA/order-book unrelated levels.
- If a price is visible on the right axis/current marker, use that if OHLC close is unclear.
- Return only valid JSON.
- No markdown.

Hints from frontend:
symbolHint=${fields.symbolHint || 'unknown'}
marketHint=${fields.marketHint || 'unknown'}

JSON schema:
{
  "symbol": "ETH/USDT",
  "assetName": "Ethereum",
  "market": "crypto",
  "detectedPrice": 1784.88,
  "timeframe": "1d",
  "hold": "4h",
  "direction": "buy" | "sell" | "wait",
  "confidence": 99,
  "setupQuality": 99,
  "risk": "low" | "medium" | "high",
  "pattern": "short pattern name",
  "reason": "short explanation"
}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType: image.mimeType, data: image.buffer.toString('base64') } },
        ],
      }],
      generationConfig: { temperature: 0.1, responseMimeType: 'application/json' },
    }),
  });

  if (!response.ok) throw new Error(`Gemini request failed: ${response.status}`);
  const payload = await response.json();
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  return extractJson(text);
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 200, { ok: true });
  if (req.method === 'GET' && req.url === '/health') return json(res, 200, { ok: true, service: 'gemini-chart-analyzer', configured: Boolean(GEMINI_API_KEY) });
  if (req.method !== 'POST' || req.url !== '/api/v1/analyze-chart') return json(res, 404, { error: 'not_found' });

  try {
    const { fields, image } = await parseMultipart(req);
    if (!image) return json(res, 400, { error: 'image_required' });
    const result = await analyzeWithGemini(image, fields);
    return json(res, 200, result);
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Gemini chart analyzer running on http://localhost:${PORT}`);
  console.log('Endpoint: POST /api/v1/analyze-chart');
});
