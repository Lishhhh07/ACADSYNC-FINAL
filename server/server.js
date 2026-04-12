import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import { errorHandler } from './utils/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// CORS Middleware - must be before routes
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ACADSYNC API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/teachers', teacherRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ACADSYNC Server running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for: ${FRONTEND_URL}`);
  console.log(`📧 Email: ${process.env.EMAIL || 'Not configured'}`);
  console.log(`🔥 Firebase Project: ${process.env.FIREBASE_PROJECT_ID || 'Not configured'}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});

export default app;
