import { motion } from "motion/react";
import { ArrowLeft, BookOpen, Users, Clock, Calendar } from "lucide-react";
import { useState } from "react";
import { CourseDetailsModal } from "./CourseDetailsModal";

interface CoursesViewProps {
  onBack: () => void;
  onOpenScheduling: () => void;
}

export function CoursesView({ onBack, onOpenScheduling }: CoursesViewProps) {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  
  const courses = [
    {
      id: 1,
      code: "CS 301",
      name: "Advanced Algorithms",
      instructor: "Dr. Robert Smith",
      schedule: "Mon, Wed 10:00 AM - 11:30 AM",
      room: "Room 301",
      credits: 3,
      color: "from-cyan-500/20 to-blue-500/20",
      borderColor: "border-cyan-500/30",
      progress: 65,
    },
    {
      id: 2,
      code: "CS 405",
      name: "Machine Learning",
      instructor: "Prof. Emily Johnson",
      schedule: "Tue, Thu 2:00 PM - 3:30 PM",
      room: "Lab A",
      credits: 4,
      color: "from-violet-500/20 to-purple-500/20",
      borderColor: "border-violet-500/30",
      progress: 45,
    },
    {
      id: 3,
      code: "MATH 301",
      name: "Linear Algebra",
      instructor: "Dr. Michael Chen",
      schedule: "Mon, Wed, Fri 1:00 PM - 2:00 PM",
      room: "Room 205",
      credits: 3,
      color: "from-pink-500/20 to-rose-500/20",
      borderColor: "border-pink-500/30",
      progress: 80,
    },
    {
      id: 4,
      code: "CS 350",
      name: "Database Systems",
      instructor: "Prof. Sarah Williams",
      schedule: "Tue, Thu 9:00 AM - 10:30 AM",
      room: "Lab B",
      credits: 3,
      color: "from-emerald-500/20 to-green-500/20",
      borderColor: "border-emerald-500/30",
      progress: 55,
    },
    {
      id: 5,
      code: "CS 420",
      name: "Software Engineering",
      instructor: "Dr. James Brown",
      schedule: "Wed, Fri 3:00 PM - 4:30 PM",
      room: "Room 401",
      credits: 4,
      color: "from-orange-500/20 to-amber-500/20",
      borderColor: "border-orange-500/30",
      progress: 70,
    },
  ];

  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#0f0322] to-[#1a0b2e] dark">
      {/* Ambient background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[150px]"
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
            <BookOpen className="w-8 h-8 text-pink-400" />
            <div>
              <h1 className="text-xl text-white">My Courses</h1>
              <p className="text-xs text-white/60">Spring 2026 Semester</p>
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
          <h2 className="text-3xl text-white mb-2">Enrolled Courses</h2>
          <p className="text-white/60">
            {courses.length} courses • {totalCredits} total credits
          </p>
        </motion.div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">Total Courses</p>
                <p className="text-3xl text-white">{courses.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">Total Credits</p>
                <p className="text-3xl text-white">{totalCredits}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">Avg Progress</p>
                <p className="text-3xl text-white">
                  {Math.round(
                    courses.reduce((sum, c) => sum + c.progress, 0) / courses.length
                  )}
                  %
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Courses list */}
        <div className="grid gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              className={`group relative p-6 bg-gradient-to-br ${course.color} backdrop-blur-xl border ${course.borderColor} rounded-2xl overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.01, y: -2 }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-white/10 rounded-lg text-sm text-white">
                        {course.code}
                      </span>
                      <span className="px-3 py-1 bg-white/10 rounded-lg text-sm text-white">
                        {course.credits} Credits
                      </span>
                    </div>
                    <h3 className="text-2xl text-white mb-2">{course.name}</h3>
                    <p className="text-sm text-white/70 mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {course.instructor}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span className="text-white/80">{course.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span className="text-white/80">{course.room}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/60">Course Progress</span>
                    <span className="text-xs text-white">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    onClick={() => setSelectedCourse(course)}
                    className="flex-1 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-sm text-cyan-400 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Course Details
                  </motion.button>
                  <motion.button
                    onClick={onOpenScheduling}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/80 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Schedule Meeting
                  </motion.button>
                </div>
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

      {/* Course Details Modal */}
      <CourseDetailsModal
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        course={selectedCourse || courses[0]}
        onScheduleMeeting={onOpenScheduling}
      />
    </div>
  );
}