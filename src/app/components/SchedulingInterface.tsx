import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, ArrowLeft, CheckCircle, X, AlertCircle } from "lucide-react";
import { useState } from "react";

interface SchedulingInterfaceProps {
  onBack: () => void;
  userType: "student" | "faculty";
}

export function SchedulingInterface({ onBack, userType }: SchedulingInterfaceProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  // Mock data for slot availability
  const slotStatus: Record<string, Record<string, "available" | "booked" | "conflict">> = {
    Mon: {
      "09:00 AM": "available",
      "10:00 AM": "booked",
      "11:00 AM": "available",
      "12:00 PM": "booked",
      "01:00 PM": "available",
      "02:00 PM": "available",
      "03:00 PM": "conflict",
      "04:00 PM": "available",
      "05:00 PM": "booked",
    },
    Tue: {
      "09:00 AM": "available",
      "10:00 AM": "available",
      "11:00 AM": "booked",
      "12:00 PM": "available",
      "01:00 PM": "conflict",
      "02:00 PM": "available",
      "03:00 PM": "available",
      "04:00 PM": "booked",
      "05:00 PM": "available",
    },
    Wed: {
      "09:00 AM": "booked",
      "10:00 AM": "available",
      "11:00 AM": "available",
      "12:00 PM": "booked",
      "01:00 PM": "available",
      "02:00 PM": "available",
      "03:00 PM": "available",
      "04:00 PM": "available",
      "05:00 PM": "conflict",
    },
    Thu: {
      "09:00 AM": "available",
      "10:00 AM": "available",
      "11:00 AM": "conflict",
      "12:00 PM": "available",
      "01:00 PM": "booked",
      "02:00 PM": "available",
      "03:00 PM": "available",
      "04:00 PM": "available",
      "05:00 PM": "available",
    },
    Fri: {
      "09:00 AM": "available",
      "10:00 AM": "booked",
      "11:00 AM": "available",
      "12:00 PM": "available",
      "01:00 PM": "available",
      "02:00 PM": "conflict",
      "03:00 PM": "available",
      "04:00 PM": "booked",
      "05:00 PM": "available",
    },
  };

  const getSlotColor = (status: "available" | "booked" | "conflict") => {
    switch (status) {
      case "available":
        return "bg-green-500/20 border-green-500/30 hover:bg-green-500/30 text-green-400";
      case "booked":
        return "bg-gray-500/20 border-gray-500/30 text-gray-500 cursor-not-allowed";
      case "conflict":
        return "bg-red-500/20 border-red-500/30 text-red-400 cursor-not-allowed";
    }
  };

  const handleSlotClick = (day: string, slot: string) => {
    const status = slotStatus[day]?.[slot];
    if (status === "available") {
      setSelectedDate(day);
      setSelectedSlot(slot);
      setIsSelecting(true);
    }
  };

  const handleConfirm = () => {
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      setSelectedDate(null);
      setSelectedSlot(null);
      setIsSelecting(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#0f0322] to-[#1a0b2e] dark">
      {/* Ambient background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[150px]"
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
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[150px]"
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
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </motion.button>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-xl">Schedule Meeting</h1>
              <p className="text-xs text-gray-400">
                {userType === "student" ? "Book a time slot" : "Set availability"}
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-3xl mb-2">Select a Time Slot</h2>
          <p className="text-gray-400 mb-8">
            {userType === "student"
              ? "Choose an available time to meet with faculty"
              : "Set your available office hours"}
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          className="flex gap-6 mb-8 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl w-fit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500/50" />
            <span className="text-sm text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-500/30 border border-gray-500/50" />
            <span className="text-sm text-gray-400">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500/30 border border-red-500/50" />
            <span className="text-sm text-gray-400">Conflict</span>
          </div>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="min-w-[800px]">
            {/* Header row */}
            <div className="grid grid-cols-6 gap-3 mb-4">
              <div className="text-center text-sm text-gray-400 py-3">Time</div>
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center py-3">
                  <div className="text-sm text-gray-400">Week 1</div>
                  <div className="text-lg">{day}</div>
                </div>
              ))}
            </div>

            {/* Time slots */}
            {timeSlots.map((time, timeIndex) => (
              <motion.div
                key={time}
                className="grid grid-cols-6 gap-3 mb-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + timeIndex * 0.05 }}
              >
                <div className="flex items-center justify-center text-sm text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  {time}
                </div>
                {daysOfWeek.map((day) => {
                  const status = slotStatus[day]?.[time] || "available";
                  const isSelected = selectedDate === day && selectedSlot === time;

                  return (
                    <motion.button
                      key={`${day}-${time}`}
                      onClick={() => handleSlotClick(day, time)}
                      className={`relative p-4 border rounded-xl transition-all ${getSlotColor(
                        status
                      )} ${isSelected ? "ring-2 ring-cyan-500 scale-105" : ""}`}
                      disabled={status !== "available"}
                      whileHover={
                        status === "available"
                          ? { scale: 1.05, y: -2 }
                          : {}
                      }
                      whileTap={status === "available" ? { scale: 0.95 } : {}}
                      animate={
                        status === "conflict"
                          ? {
                              boxShadow: [
                                "0 0 0px rgba(239, 68, 68, 0)",
                                "0 0 15px rgba(239, 68, 68, 0.3)",
                                "0 0 0px rgba(239, 68, 68, 0)",
                              ],
                            }
                          : {}
                      }
                      transition={
                        status === "conflict"
                          ? { duration: 2, repeat: Infinity }
                          : {}
                      }
                    >
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 bg-cyan-500/20 rounded-xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}

                      <div className="relative z-10">
                        {status === "conflict" && (
                          <AlertCircle className="w-4 h-4 mx-auto mb-1" />
                        )}
                        <div className="text-xs">
                          {status === "available" && "Open"}
                          {status === "booked" && "Booked"}
                          {status === "conflict" && "Conflict"}
                        </div>
                      </div>

                      {/* Hover glow for available slots */}
                      {status === "available" && (
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/0 to-cyan-500/0 opacity-0 group-hover:opacity-20 transition-opacity"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Selected slot summary */}
        <AnimatePresence>
          {isSelecting && selectedDate && selectedSlot && (
            <motion.div
              className="mt-8 p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/30 rounded-2xl"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-1">Selected Time Slot</h3>
                    <p className="text-gray-400">
                      {selectedDate}, {selectedSlot}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={() => {
                      setSelectedDate(null);
                      setSelectedSlot(null);
                      setIsSelecting(false);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleConfirm}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-shadow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm Booking
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmation modal */}
        <AnimatePresence>
          {showConfirmation && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* Modal */}
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

                <h3 className="text-2xl text-center mb-3">
                  Booking Confirmed!
                </h3>
                <p className="text-center text-gray-400 mb-6">
                  Your meeting has been scheduled for {selectedDate} at{" "}
                  {selectedSlot}
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
      </main>
    </div>
  );
}
