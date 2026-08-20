import { Router } from 'express';
import { config } from '../config/env.config.js';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Service health check and TryOn-API status reporting
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'TryNFit TryOn-API Service',
    version: '5.2.0',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: Boolean(config.tryonApiKey && config.tryonApiKey.length > 5),
    provider: 'TryOn-API (tryon-api.com)',
    model: 'fal/fashn-tryon-v1-5',
    rateLimitMaxPerHour: config.rateLimitMax,
  });
});

export default router;
