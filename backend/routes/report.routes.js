import express from 'express';
import { getDailyReport, getMonthlyReport } from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/daily', protect, getDailyReport);
router.get('/monthly', protect, getMonthlyReport);

export default router;
