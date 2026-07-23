import express from 'express';
import {
  getSecurityData,
  updateSecuritySettings,
  addWhitelistedIp,
  deleteWhitelistedIp,
} from '../controllers/securityController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getSecurityData)
  .put(protect, updateSecuritySettings);

router.post('/ip', protect, addWhitelistedIp);
router.delete('/ip/:id', protect, deleteWhitelistedIp);

export default router;
