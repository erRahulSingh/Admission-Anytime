import express from 'express';
import {
  getBillingData,
  updateSubscriptionPlan,
  updatePaymentMethod,
} from '../controllers/billingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getBillingData);

router.put('/plan', protect, updateSubscriptionPlan);
router.put('/payment-method', protect, updatePaymentMethod);

export default router;
