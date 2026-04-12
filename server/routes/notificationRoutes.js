import express from 'express';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';
import {
  getNotifications,
  markNotificationAsRead,
} from '../controllers/notificationController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);
router.use(requireRole(['student'])); // Only students can access notifications

router.get('/', getNotifications);
router.patch('/:notificationId/read', markNotificationAsRead);

export default router;
