# 🔍 ROOT CAUSE DIAGNOSIS GUIDE
## Student Meeting Requests Not Visible to Teacher

---

## 🧪 DIAGNOSTIC TEST PLAN

Follow these steps **exactly** and capture **all** console output.

### PHASE 1: Student Creates Meeting
**What to do:**
1. Open browser DevTools (F12)
2. Go to **Console** tab (clear previous logs)
3. **Switch browser identity** (use Private/Incognito window) OR use different browser
4. Login as **STUDENT**
5. Open "Schedule a Meeting"
6. Select a **specific teacher** from dropdown
7. Pick date/time in **future**
8. Add reason "TEST"
9. Click Submit

**What to capture:**
```
BROWSER CONSOLE (Student side):
[AUTH] Login response: ?
[AUTH] Token from response.data.token: ?
[Scheduling] DEBUG - Calling API with: { teacherId: ?, timeSlot: ?, reason: ? }
[Scheduling] DEBUG - API response: ?

SERVER CONSOLE:
[Auth] ✅ Token verified. User ID: ? Role: student
[Meeting] Create meeting request received
[Meeting] ✅ VERIFY - studentId matches req.user.userId? true/false
[Meeting] ✅ VERIFY - teacherId from request body? YES/NO
[Meeting] Meeting request created successfully: ?
```

**CRITICAL:** Note the `teacherId` value sent to backend.

---

### PHASE 2: Check Firestore Document
**What to do:**
1. Open Firebase Console
2. Go to Firestore Database → Collections
3. Click **"meetings"**
4. Find the document you just created (should be newest)
5. Check these fields:
   - `teacherId` = ?
   - `studentId` = ?
   - `status` = ?
   - `createdAt` = ?

**CRITICAL:** Verify `teacherId` is NOT empty/null

---

### PHASE 3: Teacher Fetches Pending
**What to do:**
1. **Logout student** (or switch to different browser/window)
2. Login as **TEACHER** (the same teacher student selected)
3. Look at FacultyDashboard
4. Open DevTools Console

**What to capture:**
```
BROWSER CONSOLE (Teacher side):
[FacultyDashboard] DEBUG - Raw API response: ?
[FacultyDashboard] DEBUG - response.requests: ?
[FacultyDashboard] DEBUG - Requests count: ?

SERVER CONSOLE:
[Auth] ✅ Token verified. User ID: ? Role: teacher
[Meeting] ✅ VERIFY - Fetching pending requests for teacherId: ?
[Meeting] ✅ VERIFY - teacherId matches req.user.userId? true/false
[Meeting] Query succeeded || Fallback query succeeded
[Meeting] DEBUG - Query returned ? documents
```

**CRITICAL:** Note the teacher's `User ID`. Does it match the `teacherId` from Firestore document?

---

## 🔴 ROOT CAUSE CHECKLIST

Test each point **in order**. Once you find "❌ FAILS", that's your root cause.

### ✅ or ❌ Test 1: Student Data Saved Correctly
**Verify in Firestore:**
```
Document fields:
  studentId: [Has value, not empty]  ✅ or ❌
  teacherId: [Has value, not empty]  ✅ or ❌
  status: "pending"  ✅ or ❌
  timeSlot: [ISO date string]  ✅ or ❌
```

**If ❌ FAILS:** Problem is in student creation (data not saved correctly)

---

### ✅ or ❌ Test 2: TeacherId Matches
**Compare these two values:**
- From Firestore document: `teacherId` = `ABC123`
- From server log when teacher logs in: `User ID: ?`

**Do they match exactly?**
```
Firestore teacherId:  ABC123
Server log User ID:   XYZ789  ← MISMATCH!
```

**If ❌ MISMATCH:** Problem is teacherid doesn't match (teacher query returns 0 results)

---

### ✅ or ❌ Test 3: Query Returns Documents
**From server console:**
```
[Meeting] DEBUG - Query returned ? documents
```

**Is count > 0?**
- ✅ YES (1 or more documents) → Go to Test 4
- ❌ NO (0 documents) → Root cause is ID mismatch (Test 2)

**If ❌ FAILS:** Problem is query not finding documents (likely teacherId mismatch or index issue)

---

### ✅ or ❌ Test 4: Response Structure Correct
**From browser console (teacher side):**
```
[FacultyDashboard] DEBUG - Requests count: ?
```

**Is count > 0?**
- ✅ YES → Data is reaching frontend → Go to Test 5
- ❌ NO → Response structure issue or filter removed data

**If ❌ FAILS:** Problem is response format or frontend filtering

---

### ✅ or ❌ Test 5: Frontend Renders Data
**Check UI:**
- Look at FacultyDashboard
- Do you see "Pending Requests" cards?

**If ❌ FAILS:** Problem is frontend rendering (unlikely, logs would show data)

---

## 🎯 MOST LIKELY ROOT CAUSES

### 🔴 **ISSUE A: TeacherId Mismatch** ← MOST LIKELY
```
When student creates meeting:
  teacherId sent = "tea-abc123" (from dropdown, Firestore document ID)
  → Saved to Firestore correctly ✅

When teacher logs in:
  req.user.userId = "tea-xyz789" (from JWT, Firestore document ID)
  → Query looks for meetings where teacherId == "tea-xyz789"
  → But Firestore document has teacherId == "tea-abc123"
  → Query returns 0 documents ❌

ROOT CAUSE: Different teacher logged in than who student selected
OR: Student selected wrong teacher
OR: Teacher IDs are corrupted
```

**Test:** Compare these in console logs:
- Student sending `teacherId` during creation
- Teacher's `User ID` when they login

Must be **exactly identical**.

---

### 🔴 **ISSUE B: TeacherId Not Stored**
```
When student creates meeting:
  [Meeting] ✅ VERIFY - teacherId from request body? NO ← Sent as null/undefined

ROOT CAUSE: Frontend not sending teacherId in request body
```

**Test:** Check student creation logs:
```
[Scheduling] DEBUG - Calling API with: { teacherId: ???
```

Should show actual teacher ID, not empty.

---

### 🔴 **ISSUE C: Status Not Saved as "pending"**
```
Firestore document shows:
  status: null or undefined or "PENDING" (capital P)

Query only looks for:
  .where('status', '==', 'pending')  ← lowercase

Query returns 0 ❌
```

**Test:** Check Firestore document field: `status`

---

### 🔴 **ISSUE D: Firestore Index Missing BUT Not Using Fallback**
```
Query requires composite index but it's not created
Fallback query in try/catch should catch this

BUT: If logs show no error, query ran.
If logs show "Query returned: 0", index is fine, issue is ID mismatch.
```

**Test:** Server console should show:
```
[Meeting] Query succeeded using composite index
OR
[Meeting] Fallback query succeeded
```

If neither appears, connection error.

---

### 🔴 **ISSUE E: Frontend Not Accessing response.requests Correctly**
```
Backend returns: { requests: [...] }
Frontend tries to access: response.requests ✅

But if API is wrapped differently:
Backend returns: { success: true, data: {...} }
Frontend tries: response.requests ❌ (undefined)

Then: response.requests.filter fails
```

**Test:** Browser console should show:
```
[FacultyDashboard] DEBUG - Requests count: ?
```

If this shows `undefined` or `NaN`, response structure issue.

---

## 📝 CAPTURE FORMAT

When you run the test, copy-paste this and fill in:

```
=== STUDENT CREATION ===
Student ID: ?
Teacher selected (teacherId): ?
API call sent teacherId: ?
Firestore doc teacherId saved: ?
Firestore doc status saved: ?

=== TEACHER LOGIN ===
Teacher ID (req.user.userId): ?
Teacher ID === Student sent teacherId? YES/NO
Server log "Query returned": ? documents

=== FRONTEND ===
[FacultyDashboard] Requests count: ?
UI shows pending requests: YES/NO

=== ROOT CAUSE ===
[Likely Issue A/B/C/D/E]
```

---

## 🚀 Next: Share These Logs

Once you've run the test, report:

1. **All captured logs** (copy-paste from console)
2. **Filled checklist** (above)
3. **Firestore document screenshot** (fields: teacherId, status)

This will identify the **exact** root cause.

---

## 💡 Quick Fix Preview (Once Root Cause Found)

| Root Cause | Fix |
|-----------|-----|
| **A: TeacherId Mismatch** | Verify student selected correct teacher, check if teachers list showing correct IDs |
| **B: TeacherId Not Sent** | Check StudentSchedulingModal is passing selectedTeacherId correctly |
| **C: Status Wrong Value** | Ensure meeting saved with lowercase `"pending"` |
| **D: Index Missing** | Fallback already handles this, but can create manual index |
| **E: Response Structure** | Check if API returns `{ requests }` vs `{ success, data }` |

---

**⏭️ ACTION:** Run diagnostic test above and share logs. I'll identify exact issue.
