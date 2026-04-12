import express from 'express';
import {
  registerStudent,
  loginStudent,
  registerTeacher,
  loginTeacher,
} from '../controllers/authController.js';

const router = express.Router();

// Student routes
router.post('/student/register', registerStudent);
router.post('/student/login', loginStudent);

// Teacher routes
router.post('/teacher/register', registerTeacher);
router.post('/teacher/login', loginTeacher);

export default router;
