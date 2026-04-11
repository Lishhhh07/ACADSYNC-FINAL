# 🎯 QUICK DEBUG REFERENCE

## Changes Made
✅ Enhanced debug logging in createMeetingRequest  
✅ Enhanced debug logging in getPendingRequests  
✅ Added Firestore composite index fallback  
✅ Frontend logs in StudentSchedulingModal  
✅ Frontend logs in FacultyDashboard

---

## 🔴 Root Cause (Most Likely)

**Firestore Composite Index Missing**

The query has:
- 2x WHERE filters (teacherId, status)
- 1x ORDERBY on different field (createdAt)

This requires a composite index in Firestore.

---

## ✅ How to Fix (If It's the Index)

### Option 1: Manual Index Creation (100% Fix)
1. Open Firebase Console
2. Go to Firestore Database → Indexes
3. Click "Create Index" (or use auto-generated link from server logs)
4. Create composite index:
   - **Collection:** meetings
   - **Fields (in order):**
     - teacherId: Ascending
     - status: Ascending  
     - createdAt: Descending

### Option 2: Automatic (Now Enabled)
✅ Added fallback code that sorts in JavaScript if index missing
✅ Still works, but slower

**Result:** Should work even without index now!

---

## 🧪 Test It

### Step 1: Check Console
Start server and watch logs:
```bash
npm run dev:server
```

### Step 2: Clear Firefox Cache
1. Browser DevTools → Application → Storage → IndexedDB
2. Delete any acadsync entries
3. Or use private/incognito window

### Step 3: Student Creates Meeting
1. Logout if logged in
2. Login as **newstudent@test.com** / password123
3. Open "Schedule Meeting"
4. Select ANY teacher
5. Pick date/time in FUTURE
6. Add reason: "Test"
7. Click Submit

**Watch console for:**
```
[Scheduling] DEBUG - Calling API with: { teacherId: "...", ... }
[Meeting] DEBUG - Creating meeting: { studentId: "...", teacherId: "..." }
```

### Step 4: Check Firestore
1. Open Firebase Console
2. Firestore Database → Collections
3. Click "meetings"
4. **You should see 1 new document with:**
   - teacherId: ✅ (not blank)
   - studentId: ✅ (not blank)
   - status: "pending"
   - createdAt: (timestamp)

### Step 5: Teacher Views Pending
1. **Switch browser tab or private window**
2. Login as **newteacher@test.com** / password123
3. Dashboard should show pending request
4. **Watch console for:**
```
[Meeting] DEBUG - Fetching pending requests for teacherId: abc123
[Meeting] Composite index? YES ✅ or FALLBACK ✅
[Meeting] Query returned: 1 documents ✅
```

---

## 🐛 If It Still Doesn't Work

### Check These

1. **Same teacher?**  
   - Student sent teacherId to SAME teacher you're logged in as?
   - ✅ Check: Both "teacherId" in request creation logs

2. **Status is "pending"?**
   - Firestore document shows status: "pending" (lowercase)?
   - ✅ Check: Firestore console

3. **Teacher ID matches?**
   - Student's request teacherId == Teacher's userId from JWT?
   - ✅ Check: Server logs show both IDs

4. **Date in future?**
   - Meeting date/time is in the FUTURE?
   - ✅ Check: FacultyDashboard tries to parse past dates

5. **No JavaScript errors?**
   - Browser Console (F12) has red errors?
   - ✅ Fix any console errors first

---

## 📊 Example Success Scenario

```
STUDENT CREATES MEETING:
[Scheduling] Calling API with: { 
  teacherId: "4g5MwKx8Y2hJqR1PvW9",  // Teacher's actual ID
  timeSlot: "2026-04-20T14:00:00.000Z",
  reason: "Course discussion"
}

[Meeting] DEBUG - Creating meeting: {
  studentId: "FxKu3lP7nY2qM8wR5",    // Student's actual ID
  teacherId: "4g5MwKx8Y2hJqR1PvW9",  // MATCHES above ✅
  status: "pending"
}

[Meeting] Meeting created: 9aBcDeFgHiJkL123

---

TEACHER FETCHES PENDING:
[Meeting] Fetching pending teacherId: 4g5MwKx8Y2hJqR1PvW9  // MATCHES ✅

[Meeting] Query returned: 1 documents ✅  // Found it!

[FacultyDashboard] Requests count: 1  ✅  // Visible!
```

---

## 🚨 If You See These Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `"FIRESTORE COMPOSITE INDEX MISSING"` | Query needs index | Create index (see above) OR it auto-uses fallback |
| `Query returned: 0` | TeacherId mismatch | Check IDs match in logs |
| Response shows `requests: undefined` | API response format issue | Check backend returning `{ requests: [...] }` |
| `"Cannot read property 'requests'"` | Frontend parsing wrong | Verify response structure |

---

## 📝 Log Format Reference

### Creation Logs
```
[Scheduling] DEBUG - Calling API with: { teacherId, timeSlot, reason }
[Meeting] DEBUG - Creating meeting: { studentId, teacherId, status, fields }
[Meeting] Meeting created: <doc-id>
[Meeting] DEBUG - Saved document: { full data }
```

### Fetch Logs
```
[Meeting] DEBUG - Fetching pending teacherId: <id>
[Meeting] Composite index? ... or FALLBACK
[Meeting] Query returned: <N> documents
[Meeting] DEBUG - Processing document: <id>
[Meeting] DEBUG - Final requests size: <N>
```

### Frontend Logs
```
[FacultyDashboard] DEBUG - Raw response: { requests: [...] }
[FacultyDashboard] DEBUG - Requests count: <N>
```

---

## ✅ Next Steps

1. **Run the test above** (student creates, teacher views)
2. **Share console logs** (both browser and server)
3. **Check Firestore document** exists with correct fields
4. If still broken, share:
   - Server console output
   - Browser console output
   - Screenshot of Firestore document

---

**Status:** Ready to debug! Run tests and check logs. 🚀
