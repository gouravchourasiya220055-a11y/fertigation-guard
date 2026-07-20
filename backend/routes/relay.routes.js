import express from 'express';
import { getRelays, controlRelay, updateRelayById } from '../controllers/relay.controller.js';

const router = express.Router();

router.get('/', getRelays);
router.post('/control', controlRelay);
router.post('/', controlRelay);
router.put('/:id', updateRelayById);

export default router;
