import express from 'express';
import {
  getMarketingData,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from '../controllers/marketingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMarketingData)
  .post(protect, createCampaign);

router.route('/:id')
  .put(protect, updateCampaign)
  .delete(protect, deleteCampaign);

export default router;
