# Debugging Guide - Frontend ↔ Backend Integration

## Fixed Issues

### 1. Port Configuration
- ✅ Backend now runs on **port 5000** (updated in `.env`)
- ✅ Frontend API calls point to `http://localhost:5000/api`
- ✅ CORS configured for `http://localhost:3000` (frontend)

### 2. CORS Configuration
- ✅ Added proper CORS middleware with:
  - Allowed origin: `http://localhost:3000`
  - Credentials enabled
  - All necessary HTTP methods
  - Authorization header support

### 3. Environment Variables
- ✅ `dotenv.config()` called before any `process.env` usage
- ✅ All config files load environment variables first
- ✅ Added validation for critical env vars (JWT_SECRET, Firebase)

### 4. Error Handling
- ✅ Enhanced error logging in all controllers
- ✅ Better error messages in frontend API utility
- ✅ Network error detection and user-friendly messages
- ✅ JSON parsing error handling

### 5. Request Logging
- ✅ Request logging middleware added
- ✅ Detailed console logs for auth operations
- ✅ Frontend API calls logged to console

## Testing the Fix

### 1. Start Backend
```bash
npm run server
```

Expected output:
```
🚀 ACADSYNC Server running on http://localhost:5000
📡 CORS enabled for: http://localhost:3000
📧 Email: lishikameghani@gmail.com
🔥 Firebase Project: acadsync-cd596
✅ Health check: http://localhost:5000/health
```

### 2. Test Health Endpoint
Open browser: `http://localhost:5000/health`

Should return:
```json
{
  "status": "ok",
  "message": "ACADSYNC API is running"
}
```

### 3. Start Frontend
```bash
npm run dev
```

Frontend should run on `http://localhost:3000`

### 4. Test Registration/Login
1. Open browser console (F12)
2. Try to register a new student
3. Check console for:
   - `[API] POST http://localhost:5000/api/auth/student/register`
   - Backend logs: `[Auth] Register student request received`
   - Success or error messages

## Common Issues & Solutions

### "Failed to fetch" Error

**Cause**: Backend not running or wrong URL
**Solution**: 
- Ensure backend is running on port 5000
- Check browser console for exact error
- Verify `VITE_API_URL` in frontend `.env` (or default to `http://localhost:5000/api`)

### CORS Error

**Cause**: Frontend origin not allowed
**Solution**:
- Backend CORS is configured for `http://localhost:3000`
- If frontend runs on different port, update `FRONTEND_URL` in `.env`

### "JWT_SECRET is not set" Error

**Cause**: Environment variable not loaded
**Solution**:
- Check `.env` file exists in root directory
- Ensure `JWT_SECRET=lish123` is set
- Restart backend server after changing `.env`

### Firebase Connection Error

**Cause**: Invalid Firebase credentials
**Solution**:
- Verify `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` in `.env`
- Check Firebase private key format (should include `\n` for newlines)
- Ensure Firebase Admin SDK is properly initialized

### Network Error: "Cannot connect to backend"

**Cause**: Backend server not running
**Solution**:
- Start backend: `npm run server`
- Check if port 5000 is available
- Verify no firewall blocking the connection

## Debugging Steps

1. **Check Backend Logs**
   - Look for request logs: `2024-01-XX - POST /api/auth/student/register`
   - Check for error messages: `[Auth] ...` or `[Firebase] ...`

2. **Check Frontend Console**
   - Look for `[API]` prefixed logs
   - Check Network tab for actual HTTP requests
   - Verify request URL is `http://localhost:5000/api/...`

3. **Check Network Tab**
   - Open DevTools → Network
   - Try login/register
   - Check request:
     - Status: Should be 200, 400, 401, or 500 (not "Failed")
     - URL: Should be `http://localhost:5000/api/...`
     - Headers: Should include `Content-Type: application/json`

4. **Verify Environment Variables**
   ```bash
   # In backend directory, check if env vars are loaded
   node -e "require('dotenv').config(); console.log(process.env.PORT, process.env.JWT_SECRET)"
   ```

## Expected Behavior

### Successful Registration
- Frontend: `[API] POST http://localhost:5000/api/auth/student/register`
- Backend: `[Auth] Register student request received`
- Backend: `[Auth] Student registered successfully: email@example.com`
- Frontend: Token stored, user redirected to dashboard

### Successful Login
- Frontend: `[API] POST http://localhost:5000/api/auth/student/login`
- Backend: `[Auth] Login student request received`
- Backend: `[Auth] Student logged in successfully: email@example.com`
- Frontend: Token stored, user redirected to dashboard

### Failed Request (Invalid Credentials)
- Frontend: `[API] Request failed: 401 - Invalid email or password`
- Backend: `[Auth] Invalid password for student: email@example.com`
- Frontend: Error message displayed to user

## Next Steps

If issues persist:
1. Check all console logs (backend and frontend)
2. Verify all environment variables are set
3. Test health endpoint directly
4. Check Firebase connection
5. Verify CORS headers in Network tab
