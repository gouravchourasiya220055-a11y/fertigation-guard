import express from 'express';
import { getRelays, controlRelay } from '../controllers/relay.controller.js';

const router = express.Router();

router.get('/', getRelays);
router.post('/control', controlRelay);

export default router;
