import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Clock, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface SharedCalendarGridProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSlot: (day: string, time: string) => void;
  mode: "schedule" | "edit";
  currentSlot?: { day: string; time: string } | null;
  title?: string;
  description?: string;
}

export function SharedCalendarGrid({
  isOpen,
  onClose,
  onSelectSlot,
  mode,
  currentSlot,
  title = "Select Time Slot",
  description = "Choose an available time that works for you",
}: SharedCalendarGridProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(
    currentSlot?.day || null
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(
    currentSlot?.time || null
  );
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  useEffect(() => {
    if (currentSlot) {
      setSelectedDate(currentSlot.day);
      setSelectedSlot(currentSlot.time);
    }
  }, [currentSlot]);

  const daysOfWeek = [
    { short: "Mon", full: "Monday" },
    { short: "Tue", full: "Tuesday" },
    { short: "Wed", full: "Wednesday" },
    { short: "Thu", full: "Thursday" },
    { short: "Fri", full: "Friday" },
  ];

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ];

  const availableSlots: Record<string, string[]> = {
    Mon: ["09:00 AM", "09:30 AM", "11:00 AM", "02:00 PM", "04:00 PM", "04:30 PM"],
    Tue: ["09:00 AM", "10:00 AM", "10:30 AM", "03:00 PM", "03:30 PM"],
    Wed: ["10:00 AM", "10:30 AM", "11:00 AM", "02:00 PM", "02:30 PM", "03:00 PM"],
    Thu: ["09:00 AM", "09:30 AM", "11:00 AM", "11:30 AM", "04:00 PM"],
    Fri: ["09:00 AM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM", "04:30 PM"],
  };

  const handleSlotSelect = (day: string, time: string) => {
    setSelectedDate(day);
    setSelectedSlot(time);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedSlot) {
      onSelectSlot(selectedDate, selectedSlot);
    }
  };

  const isSlotAvailable = (day: string, time: string) => {
    return availableSlots[day]?.includes(time);
  };

  const isSlotSelected = (day: string, time: string) => {
    return selectedDate === day && selectedSlot === time;
  };

  const isCurrentSlot = (day: string, time: string) => {
    return (
      mode === "edit" &&
      currentSlot?.day === day &&
      currentSlot?.time === time &&
      !isSlotSelected(day, time)
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={onClose}
          />

          {/* Calendar Grid Panel */}
          <motion.div
            className="fixed bottom-0 right-0 top-0 w-full max-w-4xl z-50 flex items-center justify-center p-8"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              opacity: { duration: 0.3 },
            }}
          >
            <motion.div
              className="relative w-full h-full max-h-[900px] p-8 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-cyan-500/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-y-auto"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            >
              {/* Ambient glow effects */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-white z-10"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Header */}
              <motion.div
                className="mb-8 relative z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl text-white">{title}</h2>
                    <p className="text-white/70">{description}</p>
                  </div>
                </div>

                {mode === "edit" && currentSlot && (
                  <motion.div
                    className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-sm text-yellow-400 mb-1">Current Selection:</p>
                    <p className="text-white">
                      {currentSlot.day}, {currentSlot.time}
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* Calendar Grid */}
              <div className="relative z-10 space-y-6">
                {daysOfWeek.map((day, dayIndex) => (
                  <motion.div
                    key={day.short}
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + dayIndex * 0.05 }}
                  >
                    {/* Day header */}
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 bg-gradient-to-b from-violet-500 to-cyan-500 rounded-full" />
                      <div>
                        <h3 className="text-lg text-white">{day.full}</h3>
                        <p className="text-xs text-white/50">
                          {availableSlots[day.short]?.length || 0} slots available
                        </p>
                      </div>
                    </div>

                    {/* Time slots grid */}
                    <div className="grid grid-cols-6 gap-3 pl-6">
                      {timeSlots.map((time, timeIndex) => {
                        const available = isSlotAvailable(day.short, time);
                        const selected = isSlotSelected(day.short, time);
                        const current = isCurrentSlot(day.short, time);
                        const slotKey = `${day.short}-${time}`;
                        const hovered = hoveredSlot === slotKey;

                        if (!available) {
                          return (
                            <motion.div
                              key={slotKey}
                              className="p-3 bg-white/5 border border-white/5 rounded-lg opacity-30"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 0.3, scale: 1 }}
                              transition={{ delay: 0.4 + timeIndex * 0.02 }}
                            >
                              <p className="text-xs text-white/40 text-center">{time}</p>
                            </motion.div>
                          );
                        }

                        return (
                          <motion.button
                            key={slotKey}
                            onClick={() => handleSlotSelect(day.short, time)}
                            onMouseEnter={() => setHoveredSlot(slotKey)}
                            onMouseLeave={() => setHoveredSlot(null)}
                            className={`relative p-3 rounded-lg border transition-all ${
                              selected
                                ? "bg-gradient-to-br from-violet-500/30 to-purple-500/30 border-violet-500 shadow-lg shadow-violet-500/30"
                                : current
                                ? "bg-yellow-500/20 border-yellow-500/50"
                                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                            }`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + timeIndex * 0.02 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {/* Glow effect on hover */}
                            {hovered && !selected && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-lg blur-md"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              />
                            )}

                            {/* Ripple effect on selection */}
                            {selected && (
                              <motion.div
                                className="absolute inset-0 border-2 border-violet-400 rounded-lg"
                                initial={{ scale: 1, opacity: 1 }}
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [1, 0, 1],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                            )}

                            <div className="relative z-10">
                              <p
                                className={`text-xs text-center ${
                                  selected
                                    ? "text-white font-medium"
                                    : current
                                    ? "text-yellow-400"
                                    : "text-white/80"
                                }`}
                              >
                                {time}
                              </p>
                              {selected && (
                                <motion.div
                                  className="mt-1 flex justify-center"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", delay: 0.1 }}
                                >
                                  <CheckCircle className="w-4 h-4 text-violet-400" />
                                </motion.div>
                              )}
                              {current && (
                                <p className="text-[10px] text-yellow-400 mt-1 text-center">
                                  Current
                                </p>
                              )}
                            </div>

                            {/* Hover cursor feedback */}
                            {hovered && !selected && (
                              <motion.div
                                className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Selected slot summary */}
              <AnimatePresence>
                {selectedDate && selectedSlot && (
                  <motion.div
                    className="sticky bottom-0 mt-8 p-6 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 backdrop-blur-xl border border-violet-500/30 rounded-2xl"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/70 mb-1">Selected time:</p>
                        <p className="text-xl text-white flex items-center gap-2">
                          <Clock className="w-5 h-5 text-violet-400" />
                          {daysOfWeek.find((d) => d.short === selectedDate)?.full},{" "}
                          {selectedSlot}
                        </p>
                      </div>
                      <motion.button
                        onClick={handleConfirm}
                        className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl text-white hover:shadow-lg hover:shadow-violet-500/30 transition-shadow flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <CheckCircle className="w-5 h-5" />
                        {mode === "edit" ? "Update Request" : "Continue"}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
