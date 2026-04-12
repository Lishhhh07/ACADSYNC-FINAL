import express from 'express';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';
import {
  createMeetingRequest,
  getPendingRequests,
  confirmMeeting,
  rejectMeeting,
  getStudentMeetings,
} from '../controllers/meetingController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Student routes
router.post('/request', requireRole(['student']), createMeetingRequest);
router.get('/student/meetings', requireRole(['student']), getStudentMeetings);

// Teacher routes
router.get('/pending', requireRole(['teacher']), getPendingRequests);
router.post('/confirm', requireRole(['teacher']), confirmMeeting);
router.post('/reject', requireRole(['teacher']), rejectMeeting);

export default router;
