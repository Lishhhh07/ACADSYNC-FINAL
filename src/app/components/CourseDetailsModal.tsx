import { motion, AnimatePresence } from "motion/react";
import { X, BookOpen, User, Calendar, Clock, Award } from "lucide-react";

interface CourseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    code: string;
    name: string;
    instructor: string;
    schedule: string;
    room: string;
    credits: number;
    description?: string;
  };
  onScheduleMeeting: () => void;
}

export function CourseDetailsModal({
  isOpen,
  onClose,
  course,
  onScheduleMeeting,
}: CourseDetailsModalProps) {
  const weeklySchedule = [
    { day: "Monday", time: "10:00 AM - 11:30 AM", topic: "Lecture: Algorithm Design" },
    { day: "Wednesday", time: "10:00 AM - 11:30 AM", topic: "Lecture: Data Structures" },
    { day: "Friday", time: "2:00 PM - 4:00 PM", topic: "Lab: Practical Implementation" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="relative p-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/30 rounded-3xl shadow-2xl">
              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-white"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Header */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-sm text-cyan-400">
                      {course.code}
                    </span>
                  </div>
                </div>
                <h2 className="text-3xl text-white mb-2">{course.name}</h2>
                <p className="text-white/70 flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  {course.instructor}
                </p>
              </motion.div>

              {/* Course Info Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <p className="text-xs text-white/60">Location</p>
                  </div>
                  <p className="text-white">{course.room}</p>
                </div>

                <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <p className="text-xs text-white/60">Schedule</p>
                  </div>
                  <p className="text-white text-sm">{course.schedule}</p>
                </div>

                <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <p className="text-xs text-white/60">Credits</p>
                  </div>
                  <p className="text-white">{course.credits} Credits</p>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg text-white mb-3">Course Description</h3>
                <p className="text-white/70 leading-relaxed">
                  {course.description ||
                    "This course provides an in-depth exploration of advanced concepts, methodologies, and practical applications in the field. Students will engage with cutting-edge topics through lectures, hands-on labs, and collaborative projects designed to build both theoretical understanding and practical skills."}
                </p>
              </motion.div>

              {/* Weekly Schedule */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg text-white mb-3">Weekly Schedule</h3>
                <div className="space-y-3">
                  {weeklySchedule.map((item, index) => (
                    <motion.div
                      key={index}
                      className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white mb-1">{item.day}</p>
                          <p className="text-sm text-cyan-400">{item.time}</p>
                        </div>
                        <p className="text-sm text-white/70">{item.topic}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
                <motion.button
                  onClick={() => {
                    onClose();
                    onScheduleMeeting();
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-shadow flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Meeting with Instructor
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
