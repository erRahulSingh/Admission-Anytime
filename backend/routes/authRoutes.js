import express from 'express';
import {
  loginAdmin,
  getMe,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  updatePassword,
  updatePreferences,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/login', authLimiter, loginAdmin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.put('/preferences', protect, updatePreferences);

router.route('/users')
  .get(protect, getAllUsers)
  .post(protect, createUser);

router.route('/users/:id')
  .put(protect, updateUser)
  .delete(protect, deleteUser);

export default router;
