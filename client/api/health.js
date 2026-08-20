export default function handler(req, res) {
  const apiKey = process.env.TRYON_API_KEY || '';
  return res.status(200).json({
    status: 'ok',
    service: 'TryNFit Vercel Serverless Service',
    version: '5.2.0',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: Boolean(apiKey && apiKey.length > 5),
    provider: 'TryOn-API (tryon-api.com)',
    model: 'wearfits/tryon-clothing',
    serverless: true,
  });
}
