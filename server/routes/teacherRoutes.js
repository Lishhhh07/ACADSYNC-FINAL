import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { db } from '../config/firebase.js';

const router = express.Router();

/**
 * Get list of all teachers (for student to select when scheduling)
 */
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const teachersRef = db.collection('teachers');
    const snapshot = await teachersRef.get();

    const teachers = snapshot.docs.map((doc) => ({
      id: doc.id,
      email: doc.data().email,
      // Add more fields as needed
    }));

    console.log('[Teachers] ✅ VERIFY - Teacher list returned:', teachers.map(t => ({ id: t.id, email: t.email })));

    res.json({ teachers });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
