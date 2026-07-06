import express from 'express';
import {
  getTestimonials,
  getTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTestimonials)
  .post(protect, upload.single('image'), createTestimonial);

router.get('/all', protect, getTestimonialsAdmin);

router.route('/:id')
  .put(protect, upload.single('image'), updateTestimonial)
  .delete(protect, deleteTestimonial);

export default router;
