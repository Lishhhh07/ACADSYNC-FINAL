import { db } from '../config/firebase.js';

/**
 * Create a new meeting request (Student only)
 */
export const createMeetingRequest = async (req, res) => {
  try {
    console.log('[Meeting] Create meeting request received');
    const { teacherId, selectedTimeSlot, reason } = req.body;
    const studentId = req.user.userId;

    // Validation
    if (!teacherId || !selectedTimeSlot) {
      console.log('[Meeting] Validation failed: missing teacherId or selectedTimeSlot');
      return res.status(400).json({ error: 'teacherId and selectedTimeSlot are required' });
    }

    // Validate and parse the time slot
    if (typeof selectedTimeSlot !== 'string' || selectedTimeSlot.trim() === '') {
      console.log('[Meeting] Invalid timeSlot format:', selectedTimeSlot);
      return res.status(400).json({ error: 'selectedTimeSlot must be a valid ISO datetime string' });
    }

    // Validate the date
    const meetingDate = new Date(selectedTimeSlot);
    if (isNaN(meetingDate.getTime())) {
      console.log('[Meeting] Invalid date value:', selectedTimeSlot);
      return res.status(400).json({ error: 'Invalid time value. Please select a valid date and time.' });
    }

    // Check if the date is in the past
    if (meetingDate < new Date()) {
      console.log('[Meeting] Date is in the past:', selectedTimeSlot);
      return res.status(400).json({ error: 'Cannot schedule meetings in the past' });
    }

    // Normalize to ISO string
    const normalizedTimeSlot = meetingDate.toISOString();
    console.log('[Meeting] Valid time slot:', normalizedTimeSlot);

    // Verify teacher exists
    const teacherDoc = await db.collection('teachers').doc(teacherId).get();
    if (!teacherDoc.exists) {
      console.log('[Meeting] Teacher not found:', teacherId);
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Create meeting document
    const meetingData = {
      studentId,
      teacherId,
      timeSlot: normalizedTimeSlot, // ISO string
      reason: reason || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    console.log('[Meeting] DEBUG - Creating meeting:', {
      studentId: studentId || 'UNDEFINED',
      teacherId: teacherId || 'UNDEFINED',
      status: 'pending',
      fields: Object.keys(meetingData),
    });

    console.log('[Meeting] ✅ VERIFY - studentId matches req.user.userId?', studentId === req.user.userId);
    console.log('[Meeting] ✅ VERIFY - teacherId from request body?', teacherId ? 'YES' : 'NO');

    const meetingRef = await db.collection('meetings').add(meetingData);
    const meetingId = meetingRef.id;

    console.log('[Meeting] Meeting request created successfully:', meetingId, 'Data:', meetingData);
    res.status(201).json({
      message: 'Meeting request created successfully',
      meeting: {
        id: meetingId,
        ...meetingData,
      },
    });
  } catch (error) {
    console.error('[Meeting] Error creating meeting request:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get pending meeting requests (Teacher only)
 */
export const getPendingRequests = async (req, res) => {
  try {
    const teacherId = req.user.userId;

    console.log('[Meeting] ✅ VERIFY - Fetching pending requests for teacherId:', teacherId);
    console.log('[Meeting] ✅ VERIFY - teacherId matches req.user.userId?', teacherId === req.user.userId);

    const meetingsRef = db.collection('meetings');
    
    let snapshot;
    let usedFallback = false;

    try {
      // Try the optimized query first (requires composite index)
      snapshot = await meetingsRef
        .where('teacherId', '==', teacherId)
        .where('status', '==', 'pending')
        .orderBy('createdAt', 'desc')
        .get();
      
      console.log('[Meeting] Query succeeded using composite index');
    } catch (indexError) {
      // If composite index not available, fallback to fetching without orderBy
      console.warn('[Meeting] Composite index not available, using fallback query');
      console.warn('[Meeting] Error was:', indexError.message);
      
      usedFallback = true;
      snapshot = await meetingsRef
        .where('teacherId', '==', teacherId)
        .where('status', '==', 'pending')
        .get();
      
      console.log('[Meeting] Fallback query succeeded, sorting in code');
    }

    console.log('[Meeting] DEBUG - Query returned', snapshot.size, 'documents', usedFallback ? '(using fallback)' : '');

    let requests = [];
    for (const doc of snapshot.docs) {
      const meetingData = doc.data();
      console.log('[Meeting] DEBUG - Processing document:', doc.id, 'Data:', {
        studentId: meetingData.studentId,
        teacherId: meetingData.teacherId,
        status: meetingData.status,
        createdAt: meetingData.createdAt,
      });
      
      // Get student info
      const studentDoc = await db.collection('students').doc(meetingData.studentId).get();
      const studentData = studentDoc.exists ? studentDoc.data() : null;

      requests.push({
        id: doc.id,
        ...meetingData,
        student: studentData ? {
          id: studentDoc.id,
          email: studentData.email,
        } : null,
      });
    }

    // Sort by createdAt descending if we used fallback
    if (usedFallback) {
      requests.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // Newest first
      });
      console.log('[Meeting] Sorted results in code');
    }

    console.log('[Meeting] DEBUG - Final requests array size:', requests.length);
    res.json({ requests });
  } catch (error) {
    console.error('[Meeting] ERROR in getPendingRequests:', error.message);
    console.error('[Meeting] Full error stack:', error.stack);
    
    // Check if it's a Firestore index error
    if (error.message && error.message.includes('index')) {
      console.error('[Meeting] ⚠️  FIRESTORE COMPOSITE INDEX MISSING');
      console.error('[Meeting] Go to: Firebase Console → Firestore → Indexes');
      console.error('[Meeting] Create composite index for: collections→meetings, teacherId ASC, status ASC, createdAt DESC');
    }
    
    res.status(500).json({ 
      error: 'Internal server error', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

/**
 * Confirm a meeting (Teacher only)
 */
export const confirmMeeting = async (req, res) => {
  try {
    // CRITICAL: Log the raw request body first
    console.log('[Meeting] 📨 RAW REQ BODY:', JSON.stringify(req.body));
    
    const { meetingId } = req.body;
    const teacherId = req.user.userId;

    console.log('[Meeting] ✅ VERIFY - confirmMeeting called for teacherId:', teacherId);
    console.log('[Meeting] ✅ VERIFY - teacherId matches req.user.userId?', teacherId === req.user.userId);
    console.log('[Meeting] 📥 CONFIRM REQUEST - meetingId:', meetingId);
    
    if (!meetingId) {
      console.log('[Meeting] ❌ ERROR - meetingId is missing');
      return res.status(400).json({ error: 'meetingId is required' });
    }

    // Get meeting document
    const meetingRef = db.collection('meetings').doc(meetingId);
    const meetingDoc = await meetingRef.get();

    if (!meetingDoc.exists) {
      console.log('[Meeting] ❌ ERROR - Meeting not found:', meetingId);
      return res.status(404).json({ error: 'Meeting not found' });
    }

    const meetingData = meetingDoc.data();
    console.log('[Meeting] 📄 Found meeting:', {
      id: meetingId,
      currentStatus: meetingData.status,
      teacherId: meetingData.teacherId,
      studentId: meetingData.studentId,
    });

    // Verify teacher owns this meeting
    if (meetingData.teacherId !== teacherId) {
      console.log('[Meeting] ❌ ERROR - Unauthorized: meeting teacherId', meetingData.teacherId, '!= request teacherId', teacherId);
      return res.status(403).json({ error: 'Unauthorized to confirm this meeting' });
    }

    // Update meeting status
    console.log('[Meeting] 🔄 UPDATING meeting', meetingId, 'status to "confirmed"...');
    console.log('[Meeting] 🔄 Before update: meetingRef =', meetingRef);
    
    const updateResult = await meetingRef.update({
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
    });
    
    console.log('[Meeting] ✅ UPDATE RESULT:', updateResult);
    console.log('[Meeting] ✅ UPDATED - Meeting', meetingId, 'status is now "confirmed"');

    // Verify the update actually happened by reading back
    const verifyDoc = await meetingRef.get();
    const verifyData = verifyDoc.data();
    console.log('[Meeting] 🔍 VERIFICATION - After update, meeting status is:', verifyData?.status);

    // Create notification for student
    const notificationData = {
      studentId: meetingData.studentId,
      message: `Your meeting request has been confirmed by the teacher.`,
      type: 'meeting_confirmed',
      meetingId: meetingId,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const notifResult = await db.collection('notifications').add(notificationData);
    console.log('[Meeting] 🔔 NOTIFICATION created with ID:', notifResult.id, 'for student:', meetingData.studentId);

    const responseData = {
      message: 'Meeting confirmed successfully',
      meeting: {
        id: meetingId,
        status: 'confirmed',
      },
    };
    console.log('[Meeting] 📤 SENDING RESPONSE:', JSON.stringify(responseData));
    res.json(responseData);
  } catch (error) {
    console.error('❌ ERROR confirming meeting:', error);
    console.error('❌ ERROR message:', error?.message);
    console.error('❌ ERROR code:', error?.code);
    console.error('❌ ERROR stack:', error?.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error?.message
    });
  }
};

/**
 * Reject a meeting (Teacher only)
 */
export const rejectMeeting = async (req, res) => {
  try {
    // CRITICAL: Log the raw request body first
    console.log('[Meeting] 📨 RAW REQ BODY:', JSON.stringify(req.body));
    
    const { meetingId, reason } = req.body;
    const teacherId = req.user.userId;

    console.log('[Meeting] 📥 REJECT REQUEST - meetingId:', meetingId, 'reason:', reason);
    console.log('[Meeting] ✅ VERIFY - rejectMeeting called for teacherId:', teacherId);
    
    if (!meetingId) {
      console.log('[Meeting] ❌ ERROR - meetingId is missing');
      return res.status(400).json({ error: 'meetingId is required' });
    }

    // Get meeting document
    const meetingRef = db.collection('meetings').doc(meetingId);
    const meetingDoc = await meetingRef.get();

    if (!meetingDoc.exists) {
      console.log('[Meeting] ❌ ERROR - Meeting not found:', meetingId);
      return res.status(404).json({ error: 'Meeting not found' });
    }

    const meetingData = meetingDoc.data();
    console.log('[Meeting] 📄 Found meeting:', {
      id: meetingId,
      currentStatus: meetingData.status,
      teacherId: meetingData.teacherId,
      studentId: meetingData.studentId,
    });

    // Verify teacher owns this meeting
    if (meetingData.teacherId !== teacherId) {
      console.log('[Meeting] ❌ ERROR - Unauthorized: meeting teacherId', meetingData.teacherId, '!= request teacherId', teacherId);
      return res.status(403).json({ error: 'Unauthorized to reject this meeting' });
    }

    // Update meeting status
    console.log('[Meeting] 🔄 UPDATING meeting', meetingId, 'status to "rejected"...');
    await meetingRef.update({
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason || '',
    });

    console.log('[Meeting] ✅ UPDATED - Meeting', meetingId, 'status is now "rejected"');

    // Create notification for student
    const notificationData = {
      studentId: meetingData.studentId,
      message: `Your meeting request has been declined by the teacher. ${reason ? `Reason: ${reason}` : ''}`,
      type: 'meeting_rejected',
      meetingId: meetingId,
      read: false,
      createdAt: new Date().toISOString(),
    };

    await db.collection('notifications').add(notificationData);
    console.log('[Meeting] 🔔 NOTIFICATION created for student:', meetingData.studentId);

    res.json({
      message: 'Meeting rejected successfully',
      meeting: {
        id: meetingId,
        status: 'rejected',
      },
    });
  } catch (error) {
    console.error('Error rejecting meeting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get all meetings for a student
 */
export const getStudentMeetings = async (req, res) => {
  try {
    const studentId = req.user.userId;

    console.log('[Meeting] ✅ VERIFY - Fetching student meetings for studentId:', studentId);
    console.log('[Meeting] ✅ VERIFY - studentId matches req.user.userId?', studentId === req.user.userId);
    console.log('[Meeting] 📥 FETCH STUDENT MEETINGS');
    
    const meetingsRef = db.collection('meetings');
    const snapshot = await meetingsRef
      .where('studentId', '==', studentId)
      .orderBy('createdAt', 'desc')
      .get();

    console.log('[Meeting] 📊 Found', snapshot.size, 'meetings for student', studentId);

    const meetings = [];
    for (const doc of snapshot.docs) {
      const meetingData = doc.data();
      console.log(`  - Meeting ${doc.id}: status="${meetingData.status}", timeSlot="${meetingData.timeSlot}"`);
      
      // Get teacher info
      const teacherDoc = await db.collection('teachers').doc(meetingData.teacherId).get();
      const teacherData = teacherDoc.exists ? teacherDoc.data() : null;

      meetings.push({
        id: doc.id,
        ...meetingData,
        teacher: teacherData ? {
          id: teacherDoc.id,
          email: teacherData.email,
        } : null,
      });
    }

    console.log('[Meeting] ✅ RETURNING', meetings.length, 'meetings with all statuses');
    res.json({ meetings });
  } catch (error) {
    console.error('Error fetching student meetings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
