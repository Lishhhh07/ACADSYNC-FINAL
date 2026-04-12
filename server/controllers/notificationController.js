import { db } from '../config/firebase.js';

/**
 * Get all notifications for a student
 */
export const getNotifications = async (req, res) => {
  try {
    const studentId = req.user.userId;

    console.log('[Notification] ✅ VERIFY - Fetching notifications for studentId:', studentId);
    console.log('[Notification] ✅ VERIFY - studentId matches req.user.userId?', studentId === req.user.userId);
    const snapshot = await notificationsRef
      .where('studentId', '==', studentId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const studentId = req.user.userId;

    console.log('[Notification] ✅ VERIFY - Marking notification as read for studentId:', studentId);
    console.log('[Notification] ✅ VERIFY - studentId matches req.user.userId?', studentId === req.user.userId);
    const notificationDoc = await notificationRef.get();

    if (!notificationDoc.exists) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const notificationData = notificationDoc.data();

    // Verify notification belongs to student
    if (notificationData.studentId !== studentId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await notificationRef.update({
      read: true,
      readAt: new Date().toISOString(),
    });

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
