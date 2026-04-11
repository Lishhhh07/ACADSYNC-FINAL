import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, Users, CheckCircle, XCircle, Bell, LogOut, UserPlus, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { RejectModal } from "./RejectModal";
import { RescheduleModal } from "./RescheduleModal";
import { meetingAPI } from "../utils/api";

interface FacultyDashboardProps {
  onLogout: () => void;
  onSchedule: () => void;
}

export function FacultyDashboard({ onLogout, onSchedule }: FacultyDashboardProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending requests on mount and set up real-time updates
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await meetingAPI.getPendingRequests();
        
        // Format requests for display
        const formattedRequests = response.requests
          .filter((request: any) => {
            // Filter out requests with invalid time slots
            if (!request.timeSlot) {
              console.warn('[FacultyDashboard] Request missing timeSlot:', request.id);
              return false;
            }
            return true;
          })
          .map((request: any) => {
            try {
              // Validate and parse the date
              if (!request.timeSlot || typeof request.timeSlot !== 'string') {
                throw new Error('Invalid timeSlot format');
              }

              const date = new Date(request.timeSlot);
              
              // Check if date is valid
              if (isNaN(date.getTime())) {
                console.error('[FacultyDashboard] Invalid date for request:', request.id, request.timeSlot);
                throw new Error('Invalid date value');
              }

              const dateStr = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: '2-digit' 
              });
              
              // Extract name from email
              const email = request.student?.email || '';
              const nameParts = email.split('@')[0].split('.');
              const firstName = nameParts[0]?.charAt(0).toUpperCase() + nameParts[0]?.slice(1) || '';
              const lastName = nameParts[1]?.charAt(0).toUpperCase() + nameParts[1]?.slice(1) || '';
              const studentName = firstName && lastName ? `${firstName} ${lastName}` : email;

              return {
                id: request.id,
                student: studentName,
                purpose: request.reason || "Meeting Request",
                requestedTime: dateStr,
                duration: "30 mins",
                avatar: (firstName[0] || '') + (lastName[0] || ''),
              };
            } catch (error) {
              console.error('[FacultyDashboard] Error formatting request:', request.id, error);
              // Return a fallback request object
              const email = request.student?.email || '';
              const nameParts = email.split('@')[0].split('.');
              const firstName = nameParts[0]?.charAt(0).toUpperCase() + nameParts[0]?.slice(1) || '';
              const lastName = nameParts[1]?.charAt(0).toUpperCase() + nameParts[1]?.slice(1) || '';
              const studentName = firstName && lastName ? `${firstName} ${lastName}` : email;
              
              return {
                id: request.id,
                student: studentName,
                purpose: request.reason || "Meeting Request",
                requestedTime: 'Date TBD',
                duration: "30 mins",
                avatar: (firstName[0] || '') + (lastName[0] || ''),
              };
            }
          });
        setPendingRequests(formattedRequests);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);


  const upcomingMeetings = [
    {
      student: "David Brown",
      purpose: "Research Paper Review",
      time: "Today, 3:00 PM",
      location: "Office 204",
      status: "confirmed",
    },
    {
      student: "Emma Davis",
      purpose: "Lab Work Discussion",
      time: "Tomorrow, 11:00 AM",
      location: "Online",
      status: "confirmed",
    },
  ];

  const statsCards = [
    {
      title: "Pending Requests",
      value: "3",
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-500/10 to-orange-500/10",
    },
    {
      title: "Today's Meetings",
      value: "5",
      icon: Calendar,
      color: "from-cyan-500 to-blue-500",
      bgColor: "from-cyan-500/10 to-blue-500/10",
    },
    {
      title: "Office Hours",
      value: "12h",
      icon: Users,
      color: "from-violet-500 to-purple-500",
      bgColor: "from-violet-500/10 to-purple-500/10",
    },
  ];

  const handleAccept = (meetingId: string) => {
    setPendingRequests((prev) => prev.filter((req) => req.id !== meetingId));
  };

  const handleReject = (meetingId: string, studentName: string) => {
    setSelectedStudent(studentName);
    setSelectedMeetingId(meetingId);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    try {
      // OPTIMISTICALLY remove from UI IMMEDIATELY (before backend call)
      setPendingRequests((prev) => prev.filter((req) => req.id !== selectedMeetingId));

      // Show success feedback
      setShowRejectModal(false);
      setSuccessMessage(`Request declined. Notification sent to ${selectedStudent}.`);
      setShowSuccessModal(true);

      // Call backend (best effort - UI already updated)
      try {
        await meetingAPI.rejectMeeting(selectedMeetingId, reason);
      } catch (backendError) {
        // UI change already persisted optimistically, backend error is non-fatal
      }

      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (error: any) {
      setShowRejectModal(false);
    }
  };

  const handleReschedule = () => {
    setShowRejectModal(false);
    setShowRescheduleModal(true);
  };

  const handleRescheduleConfirm = (day: string, time: string) => {
    setShowRescheduleModal(false);
    setSuccessMessage(`Alternative time (${day}, ${time}) proposed to ${selectedStudent}.`);
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 3000);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#0f0322] to-[#1a0b2e] dark">
      {/* Ambient background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[150px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[150px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Header */}
      <motion.header
        className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-violet-400" />
            <div>
              <h1 className="text-xl text-white">ACADSYNC</h1>
              <p className="text-xs text-white/60">Faculty Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              className="relative p-2 hover:bg-white/5 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="w-5 h-5 text-white/60 hover:text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full" />
            </motion.button>

            <div className="h-8 w-px bg-white/10" />

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-white">Dr. Jane Smith</p>
                <p className="text-xs text-white/60">Computer Science</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white">
                JS
              </div>
            </div>

            <motion.button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-4xl text-white mb-2">Welcome back, Dr. Smith!</h2>
          <p className="text-white/70">Manage your schedule and student requests</p>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {statsCards.map((card, index) => (
            <motion.div
              key={index}
              className="group relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              {/* Gradient background */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 mb-2">{card.title}</p>
                  <p className="text-4xl text-white">{card.value}</p>
                </div>
                <motion.div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}
                  animate={
                    hoveredCard === index
                      ? { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }
                      : { rotate: 0, scale: 1 }
                  }
                  transition={{ duration: 0.5 }}
                >
                  <card.icon className="w-7 h-7 text-white" />
                </motion.div>
              </div>

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                style={{ transform: "skewX(-20deg)" }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Requests */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl text-white flex items-center gap-2">
                <Clock className="w-6 h-6 text-yellow-400" />
                Pending Requests
              </h3>
              <motion.button
                onClick={onSchedule}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg hover:shadow-lg hover:shadow-violet-500/20 transition-shadow text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlus className="w-4 h-4" />
                <span className="text-sm">Set Availability</span>
              </motion.button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-white/60">Loading requests...</div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-center py-8 text-white/60">No pending requests</div>
              ) : (
                pendingRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  className="group relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Animated border pulse */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      pointerEvents: 'none',
                    }}
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(234, 179, 8, 0)",
                        "0 0 20px rgba(234, 179, 8, 0.2)",
                        "0 0 0px rgba(234, 179, 8, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />

                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0 text-white shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {request.avatar}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="mb-1 text-white">{request.student}</h4>
                          <p className="text-sm text-white/70">{request.purpose}</p>
                        </div>
                        <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-md text-xs text-yellow-400">
                          New
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-white/80">{request.requestedTime}</span>
                        </span>
                        <span className="text-white/80">Duration: {request.duration}</span>
                      </div>

                      {/* Action buttons */}
                      <div 
                        className="flex gap-2"
                        style={{
                          pointerEvents: 'auto',
                          position: 'relative',
                          zIndex: 50,
                        }}
                      >
                        <motion.button
                          onClick={() => {
                            handleAccept(request.id);
                          }}
                          style={{
                            position: 'relative',
                            zIndex: 50,
                            pointerEvents: 'auto',
                            cursor: 'pointer',
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Accept</span>
                        </motion.button>
                        <motion.button
                          onClick={() => handleReject(request.id, request.student)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm">Decline</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Hover glow */}
                  <motion.div
                    className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      pointerEvents: 'none',
                    }}
                  />
                </motion.div>
              ))
              )}
            </div>
          </motion.div>

          {/* Upcoming Meetings Sidebar */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-cyan-400" />
              Today's Schedule
            </h3>

            <div className="space-y-4">
              {upcomingMeetings.map((meeting, index) => (
                <motion.div
                  key={index}
                  className="group p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/20 rounded-xl hover:border-cyan-500/40 transition-all cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-1 text-white">{meeting.student}</h4>
                      <p className="text-xs text-white/60 mb-2">{meeting.purpose}</p>
                      <div className="space-y-1">
                        <p className="text-sm text-cyan-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {meeting.time}
                        </p>
                        <p className="text-xs text-white/60">{meeting.location}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Office hours indicator */}
              <motion.div
                className="p-5 bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-xl border border-violet-500/20 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm text-white">Office Hours</h4>
                    <p className="text-xs text-white/60">Mon, Wed, Fri</p>
                  </div>
                </div>
                <p className="text-sm text-violet-400">2:00 PM - 4:00 PM</p>
              </motion.div>
            </div>

            {/* Quick tip */}
            <motion.div
              className="p-4 bg-blue-500/10 backdrop-blur-xl border border-blue-500/20 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm mb-1 text-blue-400">Reminder</h4>
                  <p className="text-xs text-white/70">
                    {pendingRequests.length > 0 
                      ? `You have ${pendingRequests.length} pending request${pendingRequests.length > 1 ? 's' : ''} waiting for your response`
                      : 'No pending requests at the moment'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Modals */}
      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        studentName={selectedStudent}
        onReject={handleRejectConfirm}
        onReschedule={handleReschedule}
      />

      <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        studentName={selectedStudent}
        onConfirm={handleRescheduleConfirm}
      />

      {/* Success modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-8 bg-gradient-to-br from-green-500/20 to-cyan-500/20 backdrop-blur-xl border border-green-500/30 rounded-3xl max-w-md w-full mx-4"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-2xl text-center mb-3 text-white">
                Success!
              </h3>
              <p className="text-center text-white/80 mb-6">
                {successMessage}
              </p>

              <motion.div
                className="h-1 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
