import express from 'express';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from '../controllers/roleController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getRoles)
  .post(protect, createRole);

router.route('/:id')
  .put(protect, updateRole)
  .delete(protect, deleteRole);

export default router;
