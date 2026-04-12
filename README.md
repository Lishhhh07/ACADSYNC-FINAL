# 🎓 ACADSYNC – Academic Meeting Scheduler

A full-stack web application that streamlines student–teacher interactions through meeting scheduling, approvals, and real-time updates.

---

## 🚀 Live Demo

🌐 Frontend:https://acadsync-final.vercel.app/
🔗 Backend API: https://acadsync-final-production.up.railway.app

⚠️ *Note: Backend runs on Railway free tier — first request may take a few seconds due to cold start.*

---

## ✨ Features

* 🔐 Secure Authentication (JWT + bcrypt)
* 📅 Student → Teacher Meeting Requests
* ✅ Teacher Approval / Rejection System
* 🔔 Real-time Notifications (polling-based)
* 📧 Email Notifications for key events
* 🎭 Role-based dashboards (Student & Teacher)

---

## 🛠 Tech Stack

**Frontend**

* React (Vite + TypeScript)
* Tailwind CSS
* Framer Motion

**Backend**

* Node.js + Express
* Firebase Firestore
* JWT Authentication

**Deployment**

* Vercel (Frontend)
* Railway (Backend)

---

## 📁 Project Structure

```
acadsync/
├── server/       # Backend (Express + Firebase)
├── src/          # Frontend (React)
├── docs/         # Debug + system docs
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone & Install

```bash
npm install
```

### 2. Configure `.env`

```env
PORT=5000
JWT_SECRET=your_secret

FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="..."

EMAIL=your_email
EMAIL_APP_PASSWORD=your_password

VITE_API_URL=http://localhost:5000
```

---

### 3. Run Project

**Backend**

```bash
npm run dev:server
```

**Frontend**

```bash
npm run dev
```

---

## 🧪 How It Works

1. Student registers & logs in
2. Student requests meeting with teacher
3. Teacher accepts/rejects request
4. Student sees updated meeting status
5. Notifications + emails are triggered

---

## ⚠️ Production Notes

* Backend hosted on Railway (free tier)
* Cold start may delay first request
* Firestore queries optimized using `.limit(1)`
* Email sending is non-blocking

---

## 📚 Documentation

Detailed debugging and system analysis available in:

```
/docs
```

Includes:

* Debug guides
* System diagnostics
* API flow explanations

---

## 🚀 Future Improvements

* WebSocket-based real-time updates
* Calendar integration
* Better caching (Redis)
* Mobile optimization

---

## 👨‍💻 Author

Built by **Lishika**

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub
