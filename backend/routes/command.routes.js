import express from 'express';
import { queueCommand, fetchNextCommand } from '../controllers/command.controller.js';

const router = express.Router();

router.post('/queue', queueCommand);
router.get('/', fetchNextCommand);

export default router;
