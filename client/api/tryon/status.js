import axios from 'axios';

export const config = {
  maxDuration: 10,
};

const TRYON_API_URL = 'https://tryon-api.com/api/v1/tryon';

export default async function handler(req, res) {
  const jobId = req.query.jobId || req.query.id;
  if (!jobId) {
    return res.status(400).json({ success: false, error: 'Missing jobId in query parameters.' });
  }

  const apiKey = (process.env.TRYON_API_KEY || '').trim();
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      code: 'MISSING_API_KEY',
      error: 'TRYON_API_KEY environment variable is not configured on Vercel.',
    });
  }

  try {
    const statusResponse = await axios.get(`${TRYON_API_URL}/${jobId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      timeout: 8000,
    });

    const data = statusResponse.data;
    const status = String(data?.status || '').toLowerCase();

    // Extract result image URL
    const resultImageUrl =
      (typeof data?.images?.[0] === 'string' ? data.images[0] : data?.images?.[0]?.url) ||
      data?.data?.images?.[0]?.url ||
      data?.resultUrl ||
      data?.image_url ||
      null;

    if (status === 'completed' || status === 'succeeded' || (resultImageUrl && status !== 'failed' && status !== 'processing' && status !== 'queued')) {
      return res.status(200).json({
        success: true,
        status: 'completed',
        data: {
          id: data.id || jobId,
          status: 'completed',
          resultUrl: resultImageUrl,
          credits: data.usage?.credits ?? 1,
          model: data.model || 'wearfits/tryon-clothing',
          executionTime: '18s',
        },
      });
    }

    if (status === 'failed' || data.error) {
      const errMsg = typeof data.error === 'string'
        ? data.error
        : data.error?.message || data.routing?.attempts?.[0]?.error || 'Virtual try-on processing failed.';
      const errCode = data.errorCode || data.error?.code || 'GENERATION_FAILED';

      return res.status(200).json({
        success: false,
        status: 'failed',
        error: errMsg,
        code: errCode,
      });
    }

    // Still processing / queued
    return res.status(200).json({
      success: true,
      status: status || 'processing',
      jobId,
    });
  } catch (error) {
    console.error('Vercel Status Check Error:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    const errMsg = error.response?.data?.error?.message || error.response?.data?.error || error.message || 'Status check failed.';
    return res.status(status).json({
      success: false,
      error: errMsg,
      code: 'STATUS_CHECK_ERROR',
    });
  }
}
