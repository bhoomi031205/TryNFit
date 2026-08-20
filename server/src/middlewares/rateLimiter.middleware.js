import rateLimit from 'express-rate-limit';
import { config } from '../config/env.config.js';

export const tryonRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: `Rate limit exceeded. You can generate up to ${config.rateLimitMax} virtual try-ons per hour. Please try again later.`,
    code: 'RATE_LIMIT_EXCEEDED',
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  },
});
