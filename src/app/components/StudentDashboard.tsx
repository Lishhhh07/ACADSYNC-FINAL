import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, Users, BookOpen, Bell, LogOut, CalendarCheck, AlertCircle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { StudentSchedulingModal } from "./StudentSchedulingModal";
import { meetingAPI, notificationAPI } from "../utils/api";
import { useRealtimeNotifications } from "../hooks/useRealtimeNotifications";

interface StudentDashboardProps {
  onLogout: () => void;
  onSchedule: () => void;
  onViewMeetings: () => void;
  onViewRequests: () => void;
  onViewCourses: () => void;
}

export function StudentDashboard({ onLogout, onSchedule, onViewMeetings, onViewRequests, onViewCourses }: StudentDashboardProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Real-time notifications
  const { unreadCount } = useRealtimeNotifications(true);

  // Fetch meetings on mount and set up real-time updates
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const meetingsRes = await meetingAPI.getStudentMeetings();

        // Format meetings for display
        const formattedMeetings = meetingsRes.meetings
          .filter((meeting: any) => {
            // Filter out meetings with invalid time slots
            if (!meeting.timeSlot) {
              console.warn('[Dashboard] Meeting missing timeSlot:', meeting.id);
              return false;
            }
            return true;
          })
          .map((meeting: any) => {
            try {
              // Validate and parse the date
              if (!meeting.timeSlot || typeof meeting.timeSlot !== 'string') {
                throw new Error('Invalid timeSlot format');
              }

              const date = new Date(meeting.timeSlot);
              
              // Check if date is valid
              if (isNaN(date.getTime())) {
                console.error('[Dashboard] Invalid date for meeting:', meeting.id, meeting.timeSlot);
                throw new Error('Invalid date value');
              }

              const isToday = date.toDateString() === new Date().toDateString();
              const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();
              
              let timeStr = '';
              if (isToday) {
                timeStr = `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
              } else if (isTomorrow) {
                timeStr = `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
              } else {
                timeStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
              }

              // Set color and border based on status
              let color = "from-violet-500/20 to-purple-500/20";  // pending - default
              let borderColor = "border-violet-500/30";
              if (meeting.status === "confirmed") {
                color = "from-cyan-500/20 to-blue-500/20";
                borderColor = "border-cyan-500/30";
              } else if (meeting.status === "rejected") {
                color = "from-rose-500/20 to-red-500/20";
                borderColor = "border-rose-500/30";
              }

              return {
                title: meeting.reason || `Meeting with ${meeting.teacher?.email || 'Teacher'}`,
                time: timeStr,
                location: "Office",
                status: meeting.status,
                color: color,
                borderColor: borderColor,
              };
            } catch (error) {
              console.error('[Dashboard] Error formatting meeting:', meeting.id, error);
              // Return a fallback meeting object
              return {
                title: meeting.reason || `Meeting with ${meeting.teacher?.email || 'Teacher'}`,
                time: 'Date TBD',
                location: "Office",
                status: meeting.status || 'pending',
                color: "from-gray-500/20 to-gray-500/20",
                borderColor: "border-gray-500/30",
              };
            }
          });

        setUpcomingMeetings(formattedMeetings);
        console.log("📦 Student meetings:", formattedMeetings);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      console.log('[StudentDashboard] ⏱️ POLL CYCLE - Fetching updated meetings...');
      fetchMeetings();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenScheduling = () => {
    setShowSchedulingModal(true);
  };

  const handleSubmitRequest = (data: any) => {
    setShowSchedulingModal(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };


  const availableSlots = [
    { faculty: "Dr. Johnson", available: "Mon, Wed 2-4 PM", department: "Computer Science" },
    { faculty: "Prof. Williams", available: "Tue, Thu 10-12 PM", department: "Mathematics" },
    { faculty: "Dr. Brown", available: "Fri 1-3 PM", department: "Physics" },
  ];

  const statsCards = [
    {
      title: "Upcoming Meetings",
      value: "3",
      icon: Calendar,
      color: "from-cyan-500 to-blue-500",
      bgColor: "from-cyan-500/10 to-blue-500/10",
      onClick: onViewMeetings,
    },
    {
      title: "Pending Requests",
      value: "2",
      icon: Clock,
      color: "from-violet-500 to-purple-500",
      bgColor: "from-violet-500/10 to-purple-500/10",
      onClick: onViewRequests,
    },
    {
      title: "Courses",
      value: "5",
      icon: BookOpen,
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-500/10 to-rose-500/10",
      onClick: onViewCourses,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#0f0322] to-[#1a0b2e] dark">
      {/* Ambient background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[150px]"
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
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[150px]"
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
            <Calendar className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-xl text-white">ACADSYNC</h1>
              <p className="text-xs text-white/60">Student Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              className="relative p-2 hover:bg-white/5 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="w-5 h-5 text-white/60 hover:text-white" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full" />
              )}
            </motion.button>

            <div className="h-8 w-px bg-white/10" />

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-white">John Doe</p>
                <p className="text-xs text-white/60">CS Major</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                JD
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
          <h2 className="text-4xl text-white mb-2">Welcome back, John!</h2>
          <p className="text-white/70">Here's what's happening with your schedule</p>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {statsCards.map((card, index) => (
            <motion.button
              key={index}
              onClick={card.onClick}
              className="group relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden cursor-pointer text-left"
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
                  <motion.p
                    className="text-xs text-cyan-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Click to view details →
                  </motion.p>
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
            </motion.button>
          ))}
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Meetings */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-cyan-400" />
                Upcoming Meetings
              </h3>
              <motion.button
                onClick={handleOpenScheduling}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-shadow text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CalendarCheck className="w-4 h-4" />
                <span className="text-sm">Schedule New</span>
              </motion.button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-white/60">Loading meetings...</div>
              ) : upcomingMeetings.length === 0 ? (
                <div className="text-center py-8 text-white/60">No upcoming meetings</div>
              ) : (
                upcomingMeetings.map((meeting, index) => (
                <motion.div
                  key={index}
                  className={`group relative p-6 bg-gradient-to-br ${meeting.color} backdrop-blur-xl border ${meeting.borderColor} rounded-2xl overflow-hidden cursor-pointer`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg text-white">{meeting.title}</h4>
                        {meeting.status === "confirmed" ? (
                          <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-md text-xs text-green-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Approved
                          </span>
                        ) : meeting.status === "rejected" ? (
                          <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-md text-xs text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-md text-xs text-yellow-400">
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-white/70">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-white/90">{meeting.time}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span className="text-white/90">{meeting.location}</span>
                        </span>
                      </div>
                    </div>
                    <motion.div
                      className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Calendar className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>

                  {/* Hover glow */}
                  <motion.div
                    className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </motion.div>
              ))
              )}
            </div>
          </motion.div>

          {/* Available Slots Sidebar */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-violet-400" />
              Available Slots
            </h3>

            <div className="space-y-4">
              {availableSlots.map((slot, index) => (
                <motion.button
                  key={index}
                  onClick={handleOpenScheduling}
                  className="w-full group p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-1 text-white">{slot.faculty}</h4>
                      <p className="text-xs text-white/60 mb-2">{slot.department}</p>
                      <p className="text-sm text-cyan-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {slot.available}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
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
                  <h4 className="text-sm mb-1 text-blue-400">Quick Tip</h4>
                  <p className="text-xs text-white/70">
                    Book appointments early to secure your preferred time slots
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Scheduling Modal */}
      <StudentSchedulingModal
        isOpen={showSchedulingModal}
        onClose={() => setShowSchedulingModal(false)}
        onSubmitRequest={handleSubmitRequest}
      />

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            className="fixed bottom-8 right-8 z-50 p-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl max-w-md"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <div className="flex items-start gap-4">
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring" }}
              >
                <CheckCircle className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex-1">
                <h4 className="text-white mb-1">Request Sent Successfully!</h4>
                <p className="text-sm text-white/70">
                  Your meeting request has been sent to the faculty for confirmation. You'll be notified once they respond.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}