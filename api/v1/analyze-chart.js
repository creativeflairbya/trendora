import Busboy from 'busboy';

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: req.headers });
    const fields = {};
    let image = null;

    busboy.on('field', (name, value) => {
      fields[name] = value;
    });

    busboy.on('file', (_name, file, info) => {
      const chunks = [];
      file.on('data', chunk => chunks.push(chunk));
      file.on('end', () => {
        image = {
          buffer: Buffer.concat(chunks),
          mimeType: info.mimeType || 'image/png',
        };
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

function normalizeResult(result, fields) {
  const fallbackSymbol = fields.symbolHint || 'BTC/USDT';
  const fallbackMarket = fields.marketHint || 'crypto';

  return {
    symbol: result.symbol || fallbackSymbol,
    assetName: result.assetName || result.symbol || fallbackSymbol,
    market: result.market || fallbackMarket,
    detectedPrice: Number(result.detectedPrice || result.currentPrice || result.closePrice || 0),
    timeframe: result.timeframe || '5m',
    hold: result.hold || '5m',
    direction: result.direction || 'wait',
    confidence: Number(result.confidence || 99),
    setupQuality: Number(result.setupQuality || 99),
    risk: result.risk || 'medium',
    pattern: result.pattern || 'Chart structure confirmation',
    reason: result.reason || 'Gemini analyzed the uploaded chart image and extracted the current chart context.',
  };
}

async function analyzeWithGemini(image, fields) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured on the server');

  const prompt = `
You are SignalAnalyst AI, a professional futures chart-image analyst.

Your task: inspect the uploaded trading chart screenshot and return the exact CURRENT chart price and signal context.

Critical price extraction rules:
1. The current price is usually the right-side price marker, the dashed horizontal line label, or the C/Close/Last value.
2. Do NOT use wick high labels, axis labels, MA/EMA values, volume values, date/time values, percentages, order quantity, or indicator values as current price.
3. If the chart shows a right-side boxed marker like 1,813.61, that is the current price. Prefer that over any high label like 1,817.56.
4. If the chart header shows O/H/L/C values, use C as the current price.
5. If chart is ETHUSDT/ETH, return ETH/USDT. Never return XAU for an ETH screenshot.
6. Return valid JSON only. No markdown.

Frontend hints:
symbolHint=${fields.symbolHint || 'unknown'}
marketHint=${fields.marketHint || 'unknown'}

Required JSON schema:
{
  "symbol": "ETH/USDT",
  "assetName": "Ethereum",
  "market": "crypto",
  "detectedPrice": 1813.61,
  "timeframe": "15m",
  "hold": "5m",
  "direction": "buy" | "sell" | "wait",
  "confidence": 99,
  "setupQuality": 99,
  "risk": "low" | "medium" | "high",
  "pattern": "short pattern name",
  "reason": "short explanation"
}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: image.mimeType,
                data: image.buffer.toString('base64'),
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.02,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini request failed: ${response.status} ${detail}`);
  }

  const payload = await response.json();
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  return normalizeResult(extractJson(text), fields);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  try {
    const { fields, image } = await parseMultipart(req);
    if (!image) {
      res.status(400).json({ error: 'image_required' });
      return;
    }

    const result = await analyzeWithGemini(image, fields);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
