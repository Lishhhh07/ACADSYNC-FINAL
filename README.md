
# 🎓 ACADSYNC - Academic Meeting Scheduler

A full-stack web application for managing student-teacher meeting requests with real-time notifications and scheduling.

**Status:** ✅ Functional | 🔧 Production Ready (with optional enhancements)

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Quick Start](#quick-start)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Testing the System](#testing-the-system)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)
- [Attributions](#attributions)

---

## 🎯 Project Overview

**ACADSYNC** is a web application that bridges communication between students and teachers by providing:

- ✅ **Secure Authentication** - Student and Teacher registration/login with JWT tokens
- ✅ **Meeting Scheduling** - Students request meetings with teachers at available time slots
- ✅ **Teacher Dashboard** - Teachers view and confirm pending meeting requests
- ✅ **Real-time Notifications** - Instant updates when meetings are confirmed
- ✅ **Email Notifications** - Account verification and meeting confirmations via email
- ✅ **Role-Based Access** - Separate interfaces for students and teachers

Built with **React**, **TypeScript**, **Express.js**, **Firebase Firestore**, and deployed with **Vite**.

---

## ⚡ Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase project with Firestore database
- Gmail account with app password enabled (for email notifications)

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Configure environment variables** (`.env` file in root):
```env
# Backend
PORT=5000
JWT_SECRET=your_jwt_secret_key

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="your_private_key_with_newlines"

# Email Notifications
EMAIL=your_gmail@gmail.com
EMAIL_APP_PASSWORD=your_app_password

# Frontend
VITE_API_URL=http://localhost:5000/api
```

3. **Start the backend** (Terminal 1):
```bash
npm run dev:server
# Backend runs on http://localhost:5000
```

4. **Start the frontend** (Terminal 2):
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

5. **Open in browser:**
```
http://localhost:5173
```

---

## ✨ Features

### 🔐 Authentication System
- Student and Teacher registration with email verification
- Secure login with JWT token authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Email notifications on account creation

### 📅 Meeting Management
- **Students can:**
  - View available teachers and their calendars
  - Request meetings at specific dates and times
  - Track pending and confirmed meetings
  - Receive notifications when meetings are confirmed

- **Teachers can:**
  - View all pending meeting requests
  - Confirm or reject meeting requests
  - Generate notifications for students
  - Manage their availability

### 🔔 Notifications
- Real-time notification system with 5-second polling
- Unread notification badges
- Meeting status updates (pending → confirmed)
- Email notifications for important events
- Clear notification history

### 🗄️ Database (Firestore)
- **Collections:**
  - `students` - Student account data
  - `teachers` - Teacher account data
  - `meetings` - Meeting requests and confirmations
  - `notifications` - User notifications

### 🎨 User Interface
- Responsive design for desktop and mobile
- Clean, modern UI with motion animations
- Intuitive dashboard interfaces
- Real-time updates without page refresh
- Dark/Light theme support

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Express.js (Node.js)
- **Database:** Firebase Firestore (NoSQL)
- **Authentication:** JWT with bcrypt
- **Email:** Firebase Admin SDK + Nodemailer
- **Environment:** dotenv for configuration

### Frontend
- **Framework:** React 18 with TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS + PostCSS
- **Components:** shadcn/ui component library
- **Animations:** Framer Motion
- **HTTP Client:** Fetch API with custom wrapper

### DevOps/Deployment
- Git for version control
- ESLint for code quality

---

## 📁 Project Structure

```
acadsync/
├── server/                    # Backend (Express.js)
│   ├── config/
│   │   ├── firebase.js       # Firebase initialization
│   │   └── mailer.js         # Email configuration
│   ├── controllers/          # Request handlers
│   │   ├── authController.js
│   │   ├── meetingController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   ├── meetingRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── teacherRoutes.js
│   ├── services/
│   │   └── authService.js    # Business logic
│   ├── utils/
│   │   └── errorHandler.js
│   └── server.js             # Main server file
│
├── src/                       # Frontend (React)
│   ├── app/
│   │   ├── components/       # React components
│   │   │   ├── AuthPage.tsx
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── FacultyDashboard.tsx
│   │   │   ├── StudentSchedulingModal.tsx
│   │   │   └── ...more components
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── useRealtimeMeetings.ts
│   │   │   └── useRealtimeNotifications.ts
│   │   ├── utils/
│   │   │   └── api.ts        # API client
│   │   └── App.tsx           # Root component
│   ├── styles/               # Global styles
│   └── main.tsx              # Entry point
│
├── docs/                      # Documentation
│   ├── debugging/
│   ├── guides/
│   └── reports/
│
├── .gitignore
├── index.html                # HTML entry point
├── package.json              # Dependencies
├── vite.config.ts            # Vite configuration
├── postcss.config.mjs         # PostCSS configuration
└── README.md                 # This file
```

---

## ⚙️ Environment Setup

### 1. Firebase Configuration

Create a Firebase project and download your service account key:

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Add to `.env`:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 2. Gmail Configuration (For Email Notifications)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: myaccount.google.com → Security → App passwords
3. Add to `.env`:
```
EMAIL=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-char-app-password
```

### 3. JWT Secret

Generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env`:
```
JWT_SECRET=your_long_random_string
```

### 4. Firestore Database

1. Create Firestore database in Firebase Console
2. Set default security: Test mode (for development)
3. Note: Some queries require composite indexes (auto-created if needed)

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Start Backend:**
```bash
npm run dev:server
```

Expected output:
```
🚀 ACADSYNC Server running on http://localhost:5000
📡 CORS enabled for: http://localhost:3000
✅ Health check: http://localhost:5000/health
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

Expected output:
```
VITE v4.1.0  ready in 125 ms

➜  Local:   http://localhost:5173/
```

### Available Commands

```bash
# Backend
npm run server          # Run backend (no watch)
npm run dev:server     # Run backend with auto-reload

# Frontend
npm run dev            # Run frontend dev server
npm run build          # Build frontend for production
npm run preview        # Preview production build locally

# Health Check
curl http://localhost:5000/health
```

---

## 🧪 Testing the System

### Complete End-to-End Test

#### Step 1: Clear Browser Storage
```javascript
// In browser console (F12)
localStorage.clear()
location.reload()
```

#### Step 2: Register Student Account
1. Go to `http://localhost:5173`
2. Click "Get Started" → "Student Login"
3. Click "Create Student Account"
4. Register with valid email and password
5. Check email for verification (development mode)

#### Step 3: Register Teacher Account
1. Open new Private/Incognito window
2. Go to `http://localhost:5173`
3. Click "Get Started" → "Faculty Access"
4. Click "Create Faculty Account"
5. Register with valid email and password (different from student)

#### Step 4: Create Meeting Request (as Student)
1. Login as student
2. Click "Schedule New Meeting" or similar button
3. Select a teacher from dropdown
4. Pick future date and time
5. Add meeting reason
6. Submit request

**Expected:** Success message, meeting appears in student dashboard

#### Step 5: View Pending Requests (as Teacher)
1. Login as teacher (use private window/different browser)
2. Go to Faculty Dashboard
3. Look for pending requests section

**Expected:** Student's meeting request appears in the pending list

#### Step 6: Confirm Meeting (as Teacher)
1. Click "Accept" on the student's request
2. Confirm the action

**Expected:** Meeting status changes to "confirmed"

#### Step 7: Check Notifications (as Student)
1. Switch back to student browser tab
2. Refresh page (or wait for real-time update)
3. Check notification badge

**Expected:** Notification badge appears showing confirmed meeting

### Verification Points

| Component | Test | Expected Result |
|-----------|------|-----------------|
| Student Registration | Register with email | Account created, token stored |
| Teacher Registration | Register with email | Account created, token stored |
| Authentication | Login with credentials | Redirected to dashboard |
| Meeting Creation | Student creates meeting | Appears in dashboard |
| Teacher View | Teacher sees requests | Pending request visible |
| Confirmation | Teacher accepts meeting | Status changes to confirmed |
| Notifications | Student sees notification | Real-time update |

---

## 📚 Documentation

Comprehensive documentation is organized in the `docs/` folder:

### Quick References
- **[QUICK_DEBUG_GUIDE.md](docs/QUICK_DEBUG_GUIDE.md)** - Fast troubleshooting reference
- **[DEBUGGING.md](docs/DEBUGGING.md)** - Frontend ↔ Backend integration guide

### Diagnostic Guides
- **[DIAGNOSTIC_READY.md](docs/DIAGNOSTIC_READY.md)** - Complete diagnostic framework
- **[DIAGNOSIS_GUIDE.md](docs/DIAGNOSIS_GUIDE.md)** - Root cause analysis steps
- **[DEBUG_MEETING_VISIBILITY.md](docs/DEBUG_MEETING_VISIBILITY.md)** - Meeting visibility debugging

### Technical Analysis
- **[AUDIT_REPORT.md](docs/AUDIT_REPORT.md)** - Complete full-stack audit
- **[UID_CONSISTENCY_VERIFICATION.md](docs/UID_CONSISTENCY_VERIFICATION.md)** - ID consistency checks
- **[ID_COMPARISON_GUIDE.md](docs/ID_COMPARISON_GUIDE.md)** - ID tracking tool

### Implementation Guides
- **[DATE_FIX_SUMMARY.md](docs/DATE_FIX_SUMMARY.md)** - Date/time handling fixes
- **[Guidelines.md](docs/Guidelines.md)** - Development guidelines

---

## 🐛 Troubleshooting

### Backend Issues

**"Failed to fetch" Error**
```
Cause: Backend not running or wrong URL
Solution: 
  - Ensure backend is running: npm run dev:server
  - Check CORS configuration in server.js
  - Verify VITE_API_URL points to correct port
```

**"JWT_SECRET is not set" Error**
```
Cause: Environment variable not loaded
Solution:
  - Check .env file exists in root directory
  - Add JWT_SECRET=your_secret
  - Restart backend server
```

**CORS Error**
```
Cause: Frontend origin not allowed
Solution:
  - Update FRONTEND_URL in .env
  - Backend should be configured with correct origin
  - Clear browser cache and retry
```

**Firebase Connection Error**
```
Cause: Invalid Firebase credentials
Solution:
  - Verify FIREBASE_PROJECT_ID is correct
  - Check FIREBASE_CLIENT_EMAIL format
  - Ensure FIREBASE_PRIVATE_KEY includes \n characters
  - Test Firebase connection: Firebase Console → Firestore
```

### Frontend Issues

**"Cannot read property 'requests'"**
```
Cause: API response structure mismatch
Solution:
  - Check browser console for response data
  - Verify backend returns { requests: [...] }
  - Check Network tab in DevTools for actual response
```

**No pending requests visible**
```
Cause: Teacher ID mismatch or no meetings created
Solution:
  - Ensure student selected SAME teacher
  - Verify meeting was saved to Firestore
  - Check server logs for query results
  - See [ID_COMPARISON_GUIDE.md](docs/ID_COMPARISON_GUIDE.md)
```

**"Invalid time value" Error**
```
Cause: Date/time parsing issue
Solution:
  - Select date and time in the future
  - Ensure date is in valid format
  - Check browser console for parsing errors
  - See [DATE_FIX_SUMMARY.md](docs/DATE_FIX_SUMMARY.md)
```

### General Debugging

**Check Server Logs:**
```bash
# Look for error messages starting with [Auth], [Meeting], etc.
npm run dev:server
```

**Check Browser Console (F12):**
```javascript
// Look for [API], [AUTH], [Scheduling] messages
// Check for red errors
localStorage.getItem('token')  // Verify token exists
```

**Check Network Tab:**
1. Open DevTools → Network tab
2. Perform action (login, create meeting, etc.)
3. Click request to inspect:
   - Status code (should be 200, 201, or 4xx for user errors)
   - Request headers (should include Authorization)
   - Response body (check for errors)

**Test Health Endpoint:**
```bash
curl http://localhost:5000/health
# Should return: { "status": "ok", "message": "ACADSYNC API is running" }
```

---

## 📄 Attributions

This project includes components and assets from:

- **[shadcn/ui](https://ui.shadcn.com/)** - Component library (MIT License)
- **[Unsplash](https://unsplash.com)** - Free stock photos (Unsplash License)
- **[Figma Design](https://www.figma.com/design/GlJUB7cQs97enh23tFKkYP/ACADSYNC-Web-App-Prototype)** - Original prototype design

See [ATTRIBUTIONS.md](docs/ATTRIBUTIONS.md) for full details.

---

## 🚀 Next Steps

### For Development
1. Review [AUDIT_REPORT.md](docs/AUDIT_REPORT.md) for improvement suggestions
2. Check [DIAGNOSTIC_READY.md](docs/DIAGNOSTIC_READY.md) for testing procedures
3. Run end-to-end tests per "Testing the System" section above

### For Production Deployment
1. Update security rules in Firebase Firestore
2. Create Firestore composite indexes (auto-created if needed)
3. Set environment variables for production
4. Build frontend: `npm run build`
5. Deploy backend and frontend to production hosting

### Optional Enhancements
- Create meetingService.js and notificationService.js for service layer pattern
- Standardize response formats across all API endpoints
- Add unit tests for controllers and services
- Implement caching for teachers list
- Add OpenAPI/Swagger documentation

---

## ❓ Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review diagnostic guides in `docs/` folder
3. Check server console for detailed error messages
4. Verify environment variables are correctly set

---

**Happy scheduling! 🎓**
  