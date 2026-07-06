import express from 'express';
import {
  getUniversities,
  getUniversitiesAdmin,
  getUniversityBySlug,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} from '../controllers/universityController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getUniversities)
  .post(
    protect,
    upload.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'coverImage', maxCount: 1 },
    ]),
    createUniversity
  );

router.get('/all', protect, getUniversitiesAdmin);
router.get('/:slug', getUniversityBySlug);

router.route('/:id')
  .put(
    protect,
    upload.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'coverImage', maxCount: 1 },
    ]),
    updateUniversity
  )
  .delete(protect, deleteUniversity);

export default router;
