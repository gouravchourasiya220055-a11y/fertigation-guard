import express from 'express';
import { 
  receiveSensorData, 
  receiveStatus, 
  getLatestData,
  sendCommand
} from '../controllers/device.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ESP32 endpoints (Public for device, but should use API Key in production)
router.post('/data', receiveSensorData);
router.post('/status', receiveStatus);

// Dashboard endpoints (Protected)
router.get('/latest', protect, getLatestData);
router.post('/command', protect, sendCommand);

export default router;
