import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, MapPin, User, Video } from "lucide-react";

interface UpcomingMeetingsViewProps {
  onBack: () => void;
}

export function UpcomingMeetingsView({ onBack }: UpcomingMeetingsViewProps) {
  const meetings = [
    {
      id: 1,
      title: "Office Hours - Dr. Smith",
      faculty: "Dr. Robert Smith",
      date: "Today",
      time: "2:00 PM - 2:30 PM",
      location: "Room 301",
      type: "in-person",
      status: "confirmed",
      color: "from-cyan-500/20 to-blue-500/20",
      borderColor: "border-cyan-500/30",
      avatar: "RS",
    },
    {
      id: 2,
      title: "Project Discussion",
      faculty: "Prof. Emily Johnson",
      date: "Tomorrow",
      time: "10:00 AM - 11:00 AM",
      location: "Zoom Meeting",
      type: "online",
      status: "confirmed",
      color: "from-violet-500/20 to-purple-500/20",
      borderColor: "border-violet-500/30",
      avatar: "EJ",
    },
    {
      id: 3,
      title: "Thesis Review",
      faculty: "Dr. Michael Chen",
      date: "Jan 5, 2026",
      time: "3:00 PM - 4:00 PM",
      location: "Room 205",
      type: "in-person",
      status: "confirmed",
      color: "from-pink-500/20 to-rose-500/20",
      borderColor: "border-pink-500/30",
      avatar: "MC",
    },
    {
      id: 4,
      title: "Lab Session Follow-up",
      faculty: "Prof. Sarah Williams",
      date: "Jan 6, 2026",
      time: "1:00 PM - 1:45 PM",
      location: "Lab B",
      type: "in-person",
      status: "confirmed",
      color: "from-emerald-500/20 to-green-500/20",
      borderColor: "border-emerald-500/30",
      avatar: "SW",
    },
    {
      id: 5,
      title: "Career Counseling",
      faculty: "Dr. James Brown",
      date: "Jan 7, 2026",
      time: "11:00 AM - 12:00 PM",
      location: "Google Meet",
      type: "online",
      status: "confirmed",
      color: "from-orange-500/20 to-amber-500/20",
      borderColor: "border-orange-500/30",
      avatar: "JB",
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
      </div>

      {/* Header */}
      <motion.header
        className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center gap-4">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-xl text-white">Upcoming Meetings</h1>
              <p className="text-xs text-white/60">View all your scheduled appointments</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl text-white mb-2">Your Schedule</h2>
          <p className="text-white/60">You have {meetings.length} upcoming meetings</p>
        </motion.div>

        {/* Meetings list */}
        <div className="grid gap-6">
          {meetings.map((meeting, index) => (
            <motion.div
              key={meeting.id}
              className={`group relative p-6 bg-gradient-to-br ${meeting.color} backdrop-blur-xl border ${meeting.borderColor} rounded-2xl overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01, y: -2 }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0 text-white shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {meeting.avatar}
                    </motion.div>

                    {/* Meeting info */}
                    <div className="flex-1">
                      <h3 className="text-xl text-white mb-1">{meeting.title}</h3>
                      <p className="text-sm text-white/70 mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {meeting.faculty}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-white/60">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-cyan-400" />
                          <span className="text-white/80">{meeting.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-cyan-400" />
                          <span className="text-white/80">{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {meeting.type === "online" ? (
                            <Video className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <MapPin className="w-4 h-4 text-cyan-400" />
                          )}
                          <span className="text-white/80">{meeting.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status badge */}
                  <motion.div
                    className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-xs text-green-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  >
                    Confirmed
                  </motion.div>
                </div>

                {/* Removed action buttons per requirements */}
              </div>

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                style={{ transform: "skewX(-20deg)" }}
              />
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}