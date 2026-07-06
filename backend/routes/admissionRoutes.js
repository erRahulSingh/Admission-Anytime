import express from 'express';
import { createLead, getLeads, updateLead, deleteLead } from '../controllers/admissionController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.route('/')
  .post(apiLimiter, createLead)
  .get(protect, getLeads);

router.route('/:id')
  .put(protect, updateLead)
  .delete(protect, deleteLead);

export default router;
