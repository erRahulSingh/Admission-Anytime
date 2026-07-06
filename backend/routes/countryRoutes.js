import express from 'express';
import {
  getCountries,
  getCountriesAdmin,
  getCountryBySlug,
  createCountry,
  updateCountry,
  deleteCountry,
} from '../controllers/countryController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCountries)
  .post(
    protect,
    upload.fields([
      { name: 'flagImage', maxCount: 1 },
      { name: 'coverImage', maxCount: 1 },
    ]),
    createCountry
  );

router.get('/all', protect, getCountriesAdmin);
router.get('/:slug', getCountryBySlug);

router.route('/:id')
  .put(
    protect,
    upload.fields([
      { name: 'flagImage', maxCount: 1 },
      { name: 'coverImage', maxCount: 1 },
    ]),
    updateCountry
  )
  .delete(protect, deleteCountry);

export default router;
