import express from 'express';
import { postTelemetry, getLatest, getHistory } from '../controllers/telemetry.controller.js';

const router = express.Router();

router.route('/')
  .post(postTelemetry);

router.route('/latest')
  .get(getLatest);

router.route('/history')
  .get(getHistory);

export default router;
