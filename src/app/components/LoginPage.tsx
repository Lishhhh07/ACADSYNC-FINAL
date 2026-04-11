import { motion } from "motion/react";
import { GraduationCap, Users, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface LoginPageProps {
  onBack: () => void;
  onStudentLogin: () => void;
  onFacultyLogin: () => void;
}

export function LoginPage({ onBack, onStudentLogin, onFacultyLogin }: LoginPageProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#0f0322] to-[#1a0b2e] dark">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 opacity-40">
        <motion.div
          className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-gradient-to-r from-violet-500/40 to-purple-500/40 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/10 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="absolute top-8 left-8 z-20 flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </motion.button>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          className="w-full max-w-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl mb-4 bg-gradient-to-r from-white via-cyan-100 to-violet-100 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-lg text-gray-400">
              Select your role to continue
            </p>
          </motion.div>

          {/* Role selection cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Student Login Card */}
            <motion.button
              onClick={onStudentLogin}
              onMouseEnter={() => setHoveredCard("student")}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={
                  hoveredCard === "student"
                    ? { scale: [1, 1.05, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                animate={
                  hoveredCard === "student"
                    ? {
                        boxShadow: [
                          "0 0 0px rgba(34, 211, 238, 0)",
                          "0 0 30px rgba(34, 211, 238, 0.3)",
                          "0 0 0px rgba(34, 211, 238, 0)",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
              />

              <div className="relative z-10 space-y-6">
                {/* Icon */}
                <motion.div
                  className="relative w-20 h-20 mx-auto"
                  animate={
                    hoveredCard === "student"
                      ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                  <div className="relative w-full h-full bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                    <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                {/* Text */}
                <div className="space-y-2">
                  <h2 className="text-3xl text-white">
                    Student Login
                  </h2>
                  <p className="text-gray-400">
                    Access your class schedules, book appointments, and manage your
                    academic calendar
                  </p>
                </div>

                {/* Arrow indicator */}
                <motion.div
                  className="flex items-center justify-center gap-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={
                    hoveredCard === "student"
                      ? { x: [0, 5, 0] }
                      : { x: 0 }
                  }
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <span className="text-sm">Continue</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </motion.div>
              </div>

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                style={{ transform: "skewX(-20deg)" }}
              />
            </motion.button>

            {/* Faculty Login Card */}
            <motion.button
              onClick={onFacultyLogin}
              onMouseEnter={() => setHoveredCard("faculty")}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-violet-500/50 transition-all duration-500"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={
                  hoveredCard === "faculty"
                    ? { scale: [1, 1.05, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                animate={
                  hoveredCard === "faculty"
                    ? {
                        boxShadow: [
                          "0 0 0px rgba(139, 92, 246, 0)",
                          "0 0 30px rgba(139, 92, 246, 0.3)",
                          "0 0 0px rgba(139, 92, 246, 0)",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
              />

              <div className="relative z-10 space-y-6">
                {/* Icon */}
                <motion.div
                  className="relative w-20 h-20 mx-auto"
                  animate={
                    hoveredCard === "faculty"
                      ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, -5, 5, 0],
                        }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                  <div className="relative w-full h-full bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                {/* Text */}
                <div className="space-y-2">
                  <h2 className="text-3xl text-white">
                    Faculty Login
                  </h2>
                  <p className="text-gray-400">
                    Manage office hours, approve meeting requests, and coordinate
                    with students
                  </p>
                </div>

                {/* Arrow indicator */}
                <motion.div
                  className="flex items-center justify-center gap-2 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={
                    hoveredCard === "faculty"
                      ? { x: [0, 5, 0] }
                      : { x: 0 }
                  }
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <span className="text-sm">Continue</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </motion.div>
              </div>

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                style={{ transform: "skewX(-20deg)" }}
              />
            </motion.button>
          </div>

          {/* Footer text */}
          <motion.p
            className="text-center mt-12 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Secure authentication powered by ACADSYNC
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
