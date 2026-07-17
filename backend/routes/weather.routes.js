import express from 'express';
import { getWeather } from '../controllers/weather.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getWeather);

export default router;
