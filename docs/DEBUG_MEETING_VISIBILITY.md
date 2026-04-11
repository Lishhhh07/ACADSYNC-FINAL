# 🔍 DEBUG GUIDE: Student Meeting Request Not Visible to Teacher

## Problem
Student creates meeting request → Backend saves OK → Teacher fetches pending requests → Requests NOT visible

---

## Root Cause Analysis (To Be Determined)

### Potential Issue #1: Firestore Composite Index Required
**Probability:** HIGH

**The Query:**
```javascript
meetingsRef
  .where('teacherId', '==', teacherId)      // Filter 1
  .where('status', '==', 'pending')          // Filter 2
  .orderBy('createdAt', 'desc')              // Order by DIFFERENT field
  .get()
```

**Why This Might Fail:**
- Firestore requires a composite index when ordering by a field NOT in the WHERE clause
- Modern Firestore should auto-create this, but if not, query fails silently
- Error is caught and logged as "Internal server error"

**Solution:** Check Firestore console for "Build your first index" message

---

### Potential Issue #2: TeacherId Mismatch
**Probability:** MEDIUM

**Scenario:**
- Student sends `teacherId` (from dropdown) = `"ABC123"`
- Teacher's `req.user.userId` = `"XYZ789"` (different!)
- Query finds nothing because no meetings have `teacherId == "XYZ789"`

**Why:** If teacher login or teacher list not returning matching IDs

---

### Potential Issue #3: Status Field Mismatch
**Probability:** LOW

**Scenario:**
- Meeting saved with `status: "pending"`
- Query looks for `status == "pending"` (exact match)
- But if stored as `"Pending"` (capital P), query finds nothing

**Confirmed:** Code explicitly uses lowercase `'pending'` - unlikely issue

---

## Debug Logs Added ✅

### Student Creates Meeting
**File:** `server/controllers/meetingController.js` (line ~59)
```
[Meeting] DEBUG - Creating meeting: {
  studentId: "student-123-or-UNDEFINED",
  teacherId: "teacher-123-or-UNDEFINED",
  status: "pending",
  fields: ["studentId", "teacherId", "timeSlot", "reason", "status", "createdAt"]
}

[Meeting] Meeting request created successfully: meeting-doc-id
[Meeting] DEBUG - Saved document: { full data }
```

**What to Look For:**
- Is `studentId` present or "UNDEFINED"?
- Is `teacherId` present or "UNDEFINED"?
- Are all expected fields in the array?

---

### Teacher Fetches Pending Requests
**File:** `server/controllers/meetingController.js` (line ~89)
```
[Meeting] DEBUG - Fetching pending requests for teacherId: teacher-id-or-undefined
[Meeting] DEBUG - Query returned: <number> documents
[Meeting] DEBUG - Final requests array size: <number>
```

If size = 0, one of these is the problem:
- teacherId doesn't match any meetings' teacherId
- No status='pending' meetings exist
- Query threw error and was caught

---

### Frontend Receives Data
**File:** `src/app/components/FacultyDashboard.tsx` (useEffect)
```
[FacultyDashboard] DEBUG - Raw API response: { ... }
[FacultyDashboard] DEBUG - response.requests: [ ... ]
[FacultyDashboard] DEBUG - Requests count: <number>
```

If count = 0 even though backend shows "Query returned: 5 documents", frontend parsing issue

---

### Student Creates Request (Frontend)
**File:** `src/app/components/StudentSchedulingModal.tsx` (handleSubmit)
```
[Scheduling] DEBUG - Calling API with: {
  teacherId: "...",
  timeSlot: "2026-04-15T14:30:00.000Z",
  reason: "..."
}

[Scheduling] DEBUG - API response: { message, meeting, ... }
```

---

## 🧪 TESTING STEPS TO RUN

### Step 1: Check Server Logs
1. Start server: `npm run dev:server`
2. Watch console for debug messages

### Step 2: Create a Meeting as Student
1. Login as **student**
2. Open "Schedule a Meeting"
3. Select a teacher
4. Pick a date/time in future
5. Add reason
6. Click "Submit"

**Expected console output:**
```
[Scheduling] DEBUG - Calling API with: { teacherId: "...", timeSlot: "...", reason: "..." }
[Meeting] DEBUG - Creating meeting: { studentId: "...", teacherId: "..." }
[Meeting] Meeting request created successfully: <id>
```

**If NOT seeing these:**
- Frontend not calling API
- Frontend error happening (check browser console too)

---

### Step 3: Check if Data Saved
1. Go to Firestore Console
2. Navigate to `Collections` → `meetings`
3. Look for newest document
4. Verify fields:
   - `teacherId` = teacher's ID (same as teacher's `req.user.userId`)
   - `studentId` = student's ID
   - `status` = `"pending"` (lowercase)
   - `createdAt` = timestamp

**If missing or mismatched, document creation issue**

---

### Step 4: Fetch as Teacher
1. Logout student
2. Login as **teacher**
3. Look at FacultyDashboard

**Expected console output:**
```
[Meeting] DEBUG - Fetching pending requests for teacherId: <teacher-id>
[Meeting] DEBUG - Query returned: <N> documents
[Meeting] DEBUG - Final requests array size: <N>
[FacultyDashboard] DEBUG - Raw API response: { requests: [...] }
[FacultyDashboard] DEBUG - Requests count: <N>
```

**If `Query returned: 0`:**
- Issue #1: Firestore index error (check Firestore logs)
- Issue #2: teacherId mismatch (compare with Firestore data)
- Issue #3: No pending meetings exist yet

---

## 🔧 TEMPORARY WORKAROUND (If Needed)

If Firestore index is the blocker, use this query without orderBy:

```javascript
// Version without orderBy (no index needed)
const snapshot = await meetingsRef
  .where('teacherId', '==', teacherId)
  .where('status', '==', 'pending')
  .get();

// Sort in JavaScript instead
const requests = snapshot.docs
  .map(doc => ({ id: doc.id, ...doc.data() }))
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
```

This works without a composite index!

---

## 📋 Checklist After Adding Logs

Before running tests:
- [ ] Debug logs added to createMeetingRequest ✅
- [ ] Debug logs added to getPendingRequests ✅
- [ ] Debug logs added to FacultyDashboard fetch ✅
- [ ] Debug logs added to StudentSchedulingModal submit ✅
- [ ] Environment: NODE_ENV should be 'development' to see error details ✅

---

## Next: Run Tests and Share Logs

Run a complete flow (student create → teacher view) and share:
1. **Browser Console** output
2. **Server Console** output
3. **Firestore Console** → collections/meetings (check if document exists)

This will reveal the exact cause!
