# ACADSYNC Backend API

A production-ready Node.js + Express backend for the ACADSYNC web application.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Email**: Nodemailer (Gmail SMTP)
- **Environment**: dotenv

## Project Structure

```
server/
├── config/
│   ├── firebase.js      # Firebase Admin SDK configuration
│   └── mailer.js        # Nodemailer email service
├── controllers/
│   ├── authController.js        # Authentication logic
│   ├── meetingController.js     # Meeting management
│   └── notificationController.js # Notifications
├── middleware/
│   └── authMiddleware.js        # JWT authentication middleware
├── routes/
│   ├── authRoutes.js           # Auth endpoints
│   ├── meetingRoutes.js       # Meeting endpoints
│   ├── notificationRoutes.js  # Notification endpoints
│   └── teacherRoutes.js       # Teacher endpoints
├── utils/
│   └── errorHandler.js        # Error handling utilities
└── server.js                  # Main server file
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# Server
PORT=3000
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=your-secret-key-here

# Email (Gmail SMTP)
EMAIL=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password-here

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Go to Project Settings > Service Accounts
4. Generate a new private key
5. Copy the values to your `.env` file

### 4. Gmail SMTP Setup

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password for "Mail"
4. Use this password in `EMAIL_APP_PASSWORD`

### 5. Run the Server

```bash
# Development (with auto-reload)
npm run dev:server

# Production
npm run server
```

## API Endpoints

### Authentication

#### Student Registration
```
POST /api/auth/student/register
Body: { email, password }
Response: { token, user, message }
```

#### Student Login
```
POST /api/auth/student/login
Body: { email, password }
Response: { token, user, message }
```

#### Teacher Registration
```
POST /api/auth/teacher/register
Body: { email, password }
Response: { token, user, message }
```

#### Teacher Login
```
POST /api/auth/teacher/login
Body: { email, password }
Response: { token, user, message }
```

### Meetings

#### Create Meeting Request (Student)
```
POST /api/meetings/request
Headers: { Authorization: Bearer <token> }
Body: { teacherId, selectedTimeSlot, reason? }
Response: { message, meeting }
```

#### Get Student Meetings
```
GET /api/meetings/student/meetings
Headers: { Authorization: Bearer <token> }
Response: { meetings }
```

#### Get Pending Requests (Teacher)
```
GET /api/meetings/pending
Headers: { Authorization: Bearer <token> }
Response: { requests }
```

#### Confirm Meeting (Teacher)
```
POST /api/meetings/confirm
Headers: { Authorization: Bearer <token> }
Body: { meetingId }
Response: { message, meeting }
```

### Notifications

#### Get Notifications (Student)
```
GET /api/notifications
Headers: { Authorization: Bearer <token> }
Response: { notifications }
```

#### Mark Notification as Read
```
PATCH /api/notifications/:notificationId/read
Headers: { Authorization: Bearer <token> }
Response: { message }
```

### Teachers

#### Get Teachers List
```
GET /api/teachers/list
Headers: { Authorization: Bearer <token> }
Response: { teachers }
```

## Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (student/teacher)
- ✅ Protected routes with middleware
- ✅ Input validation
- ✅ CORS configuration

## Database Schema

### Collections

#### students/
```javascript
{
  email: string,
  password: string (hashed),
  role: "student",
  createdAt: ISO string
}
```

#### teachers/
```javascript
{
  email: string,
  password: string (hashed),
  role: "teacher",
  createdAt: ISO string
}
```

#### meetings/
```javascript
{
  studentId: string,
  teacherId: string,
  timeSlot: ISO string,
  reason: string,
  status: "pending" | "confirmed",
  createdAt: ISO string,
  confirmedAt?: ISO string
}
```

#### notifications/
```javascript
{
  studentId: string,
  message: string,
  type: string,
  meetingId?: string,
  read: boolean,
  createdAt: ISO string,
  readAt?: ISO string
}
```

## Error Handling

All errors are handled centrally through the `errorHandler` middleware. Errors return:

```json
{
  "error": "Error message"
}
```

## Email Notifications

The system automatically sends emails for:
- User registration
- User login
- Meeting confirmations (via notifications)

## Real-time Updates

The frontend uses polling (every 5 seconds) to check for updates. In production, consider:
- WebSockets
- Firebase Realtime Database
- Server-Sent Events (SSE)

## Production Considerations

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, random secret
3. **Rate Limiting**: Add rate limiting for API endpoints
4. **Logging**: Implement proper logging (Winston, Pino)
5. **Monitoring**: Add health checks and monitoring
6. **Database Indexes**: Create Firestore indexes for queries
7. **Error Tracking**: Integrate Sentry or similar
8. **HTTPS**: Always use HTTPS in production

## License

MIT
