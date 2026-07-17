import express from 'express';
import { updateProfile } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);

export default router;
