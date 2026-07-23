import express from 'express';
import { getReportsData } from '../controllers/reportController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getReportsData);

export default router;
