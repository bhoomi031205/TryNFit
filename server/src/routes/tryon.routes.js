import { Router } from 'express';
import { handleGenerateTryOn, handleProxyImage, handleSaveLook } from '../controllers/tryon.controller.js';
import { tryonUploadMiddleware } from '../middlewares/upload.middleware.js';
import { tryonRateLimiter } from '../middlewares/rateLimiter.middleware.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/proxy-image', handleProxyImage);
router.post('/', optionalAuth, tryonRateLimiter, tryonUploadMiddleware, handleGenerateTryOn);
router.post('/generate', optionalAuth, tryonRateLimiter, tryonUploadMiddleware, handleGenerateTryOn);
router.post('/save', optionalAuth, handleSaveLook);

export default router;
