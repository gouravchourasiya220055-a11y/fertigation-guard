import express from 'express';
import { getLiveSensors, getSensorHistory, ingestESP32Data, getLatestSensors } from '../controllers/sensor.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/live', protect, getLiveSensors);
router.get('/history', protect, getSensorHistory);
router.get('/latest', protect, getLatestSensors);
router.post('/', ingestESP32Data);

export default router;
