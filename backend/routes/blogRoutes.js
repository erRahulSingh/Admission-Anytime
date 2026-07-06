import express from 'express';
import {
  getBlogs,
  getBlogsAdmin,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, upload.single('featuredImage'), createBlog);

router.get('/all', protect, getBlogsAdmin);
router.get('/:slug', getBlogBySlug);

router.route('/:id')
  .put(protect, upload.single('featuredImage'), updateBlog)
  .delete(protect, deleteBlog);

export default router;
