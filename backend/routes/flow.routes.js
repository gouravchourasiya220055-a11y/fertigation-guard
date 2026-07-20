import express from 'express';
import { getFlowStats } from '../controllers/flow.controller.js';

const router = express.Router();

router.get('/', getFlowStats);

export default router;
