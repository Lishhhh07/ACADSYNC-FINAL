import { motion, useMotionValue, useTransform } from "motion/react";
import { Calendar, ArrowRight, LogIn } from "lucide-react";
import { useEffect, useState } from "react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#0f0322] to-[#1a0b2e] dark">
      {/* Animated background gradient mesh */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/30 rounded-full blur-[120px]"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-between min-h-screen px-8 md:px-16 lg:px-24 max-w-7xl mx-auto">
        {/* Left side - Hero text */}
        <motion.div
          className="flex-1 space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          }}
        >
          {/* Logo/Brand */}
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <Calendar className="w-10 h-10 text-cyan-400" />
              <div className="absolute inset-0 blur-xl bg-cyan-400/50" />
            </div>
            <span className="text-2xl tracking-wide text-white">ACADSYNC</span>
          </motion.div>

          {/* Headline */}
          <div className="space-y-4">
            <motion.h1
              className="text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-white via-cyan-100 to-violet-100 bg-clip-text text-transparent">
                Sync Academia.
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-200 via-violet-200 to-white bg-clip-text text-transparent">
                Simplify Schedules.
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-300/80 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              The intelligent scheduling platform that eliminates conflicts and
              streamlines academic coordination for students and faculty.
            </motion.p>
          </div>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {/* Primary CTA */}
            <motion.button
              onClick={onGetStarted}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-xl overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-violet-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
              
              {/* Ripple effect on hover */}
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ scale: 0, opacity: 0.5 }}
                whileHover={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
              
              <span className="relative flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              onClick={onLogin}
              className="group relative px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative flex items-center gap-2 text-gray-200">
                <LogIn className="w-5 h-5" />
                Login
              </span>
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex gap-8 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {[
              { label: "Universities", value: "50+" },
              { label: "Active Users", value: "10K+" },
              { label: "Conflicts Resolved", value: "100K+" },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-2xl text-cyan-400">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side - 3D floating calendar blocks */}
        <motion.div
          className="hidden lg:flex flex-1 items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
          }}
        >
          <FloatingCalendarBlocks />
        </motion.div>
      </div>
    </div>
  );
}

// 3D Floating Calendar Blocks Component
function FloatingCalendarBlocks() {
  return (
    <div className="relative w-full h-[600px]">
      {/* Multiple calendar block cards */}
      {[
        { delay: 0, rotation: 12, x: -100, y: -50, color: "from-cyan-500/20 to-blue-500/20" },
        { delay: 0.5, rotation: -8, x: 50, y: 80, color: "from-violet-500/20 to-purple-500/20" },
        { delay: 1, rotation: 5, x: -50, y: 150, color: "from-pink-500/20 to-rose-500/20" },
        { delay: 1.5, rotation: -15, x: 100, y: -100, color: "from-indigo-500/20 to-blue-500/20" },
      ].map((block, i) => (
        <motion.div
          key={i}
          className={`absolute left-1/2 top-1/2 w-64 h-80 bg-gradient-to-br ${block.color} backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl`}
          style={{
            x: block.x,
            y: block.y,
          }}
          animate={{
            rotateY: [block.rotation, block.rotation + 10, block.rotation],
            rotateX: [0, 5, 0],
            y: [block.y, block.y - 20, block.y],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: block.delay,
            ease: "easeInOut",
          }}
        >
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
            <span className="text-sm text-gray-300">January 2026</span>
            <Calendar className="w-5 h-5 text-cyan-400" />
          </div>

          {/* Time slots */}
          <div className="space-y-3">
            {[
              { time: "09:00 AM", title: "Lecture", color: "bg-cyan-500/30" },
              { time: "11:00 AM", title: "Lab Session", color: "bg-violet-500/30" },
              { time: "02:00 PM", title: "Tutorial", color: "bg-pink-500/30" },
              { time: "04:00 PM", title: "Office Hours", color: "bg-blue-500/30" },
            ].map((slot, j) => (
              <motion.div
                key={j}
                className={`${slot.color} backdrop-blur-sm rounded-lg p-3 border border-white/10`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: block.delay + j * 0.1 }}
              >
                <div className="text-xs text-gray-400">{slot.time}</div>
                <div className="text-sm text-white mt-1">{slot.title}</div>
              </motion.div>
            ))}
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-50" />
        </motion.div>
      ))}

      {/* Center ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
    </div>
  );
}
