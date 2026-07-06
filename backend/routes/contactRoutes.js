import express from 'express';
import { createContact, getContacts, updateContact, deleteContact } from '../controllers/contactController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.route('/')
  .post(apiLimiter, createContact)
  .get(protect, getContacts);

router.route('/:id')
  .put(protect, updateContact)
  .delete(protect, deleteContact);

export default router;
