import express from 'express';
import { getAlerts, markAsRead, deleteAlert } from '../controllers/alert.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/:farmId', getAlerts);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteAlert);

export default router;
