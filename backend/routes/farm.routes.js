import express from 'express';
import { getFarms, getFarm, createFarm, updateFarm, deleteFarm } from '../controllers/farm.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All farm routes are protected

router.route('/')
  .get(getFarms)
  .post(createFarm);

router.route('/:id')
  .get(getFarm)
  .put(updateFarm)
  .delete(deleteFarm);

export default router;
