import express from 'express';
import { getAutomationRules, createAutomationRule, updateAutomationRule } from '../controllers/automation.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAutomationRules);
router.post('/', protect, createAutomationRule);
router.put('/:id', protect, updateAutomationRule);

export default router;
