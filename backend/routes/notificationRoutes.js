import express from 'express';
import {
  getNotificationsData,
  updateNotificationPreferences,
  markAllRead,
} from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getNotificationsData);

router.put('/preferences', protect, updateNotificationPreferences);
router.put('/mark-all-read', protect, markAllRead);

export default router;
