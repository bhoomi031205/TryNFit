import { Router } from 'express';
import {
  handleGetHistory,
  handleAddHistory,
  handleDeleteHistoryItem,
  handleClearAllHistory,
} from '../controllers/history.controller.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(optionalAuth);

router.get('/', handleGetHistory);
router.post('/', handleAddHistory);
router.delete('/:id', handleDeleteHistoryItem);
router.delete('/', handleClearAllHistory);

export default router;
