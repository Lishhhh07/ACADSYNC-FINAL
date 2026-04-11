import { motion, AnimatePresence } from "motion/react";
import { X, Send, User } from "lucide-react";
import { useState, useEffect } from "react";
import { SharedCalendarGrid } from "./SharedCalendarGrid";
import { teacherAPI, meetingAPI } from "../utils/api";

interface StudentSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequest: (data: {
    day: string;
    time: string;
    reason: string;
    teacher: string;
  }) => void;
  mode?: "schedule" | "edit";
  existingRequest?: {
    day: string;
    time: string;
    reason: string;
    teacher: string;
  } | null;
}

export function StudentSchedulingModal({
  isOpen,
  onClose,
  onSubmitRequest,
  mode = "schedule",
  existingRequest,
}: StudentSchedulingModalProps) {
  const [step, setStep] = useState<"calendar" | "reason" | "teacher">("calendar");
  const [selectedDate, setSelectedDate] = useState<string | null>(
    existingRequest?.day || null
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(
    existingRequest?.time || null
  );
  const [reason, setReason] = useState(existingRequest?.reason || "");
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(
    existingRequest?.teacher || null
  );
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  // Fetch teachers on mount
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoadingTeachers(true);
      try {
        const response = await teacherAPI.getTeachers();
        // Format teachers for display
        const formattedTeachers = response.teachers.map((teacher: any) => {
          const nameParts = teacher.email.split('@')[0].split('.');
          const firstName = nameParts[0]?.charAt(0).toUpperCase() + nameParts[0]?.slice(1) || '';
          const lastName = nameParts[1]?.charAt(0).toUpperCase() || '';
          const name = firstName && lastName ? `${firstName} ${lastName}` : teacher.email;
          const initials = (firstName[0] || '') + (lastName[0] || '');
          return {
            id: teacher.id,
            name: `Dr. ${name}`,
            email: teacher.email,
            department: "General",
            avatar: initials || 'T',
          };
        });
        console.log('[Scheduling] ✅ VERIFY - Teachers loaded:', formattedTeachers.map(t => ({ id: t.id, email: t.email })));
        setTeachers(formattedTeachers);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        // Fallback to empty array
        setTeachers([]);
      } finally {
        setLoadingTeachers(false);
      }
    };

    if (isOpen && step === "teacher") {
      fetchTeachers();
    }
  }, [isOpen, step]);

  const handleSlotSelect = (day: string, time: string) => {
    setSelectedDate(day);
    setSelectedSlot(time);
    setShowCalendar(false);
    setStep("reason");
  };

  const handleContinueToTeacher = () => {
    if (reason.trim()) {
      setStep("teacher");
    }
  };

  // Helper function to convert 12-hour time to 24-hour format
  const convertTo24Hour = (time12h: string): string => {
    const [time, period] = time12h.split(' ');
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours, 10);
    
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}`;
  };

  // Helper function to get next occurrence of a weekday
  const getNextWeekdayDate = (dayName: string): Date => {
    const dayMap: Record<string, number> = {
      'Mon': 1,
      'Tue': 2,
      'Wed': 3,
      'Thu': 4,
      'Fri': 5,
    };
    
    const targetDay = dayMap[dayName];
    if (targetDay === undefined) {
      throw new Error(`Invalid day name: ${dayName}`);
    }
    
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysUntilTarget = (targetDay - currentDay + 7) % 7 || 7; // Next occurrence
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);
    targetDate.setHours(0, 0, 0, 0); // Reset to start of day
    
    return targetDate;
  };

  const handleSubmit = async () => {
    if (selectedDate && selectedSlot && reason.trim() && selectedTeacherId) {
      setIsSubmitting(true);
      try {
        // Validate inputs
        if (!selectedDate || !selectedSlot) {
          throw new Error('Please select both date and time');
        }

        // Get the actual date for the selected weekday
        const targetDate = getNextWeekdayDate(selectedDate);
        
        // Convert 12-hour time to 24-hour format
        const time24h = convertTo24Hour(selectedSlot);
        const [hours, minutes] = time24h.split(':');
        
        // Set the time on the target date
        targetDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        
        // Validate the date is valid
        if (isNaN(targetDate.getTime())) {
          throw new Error('Invalid date or time selected');
        }
        
        // Convert to ISO string
        const selectedTimeSlot = targetDate.toISOString();
        
        console.log('[Scheduling] Creating meeting request:', {
          day: selectedDate,
          time: selectedSlot,
          isoString: selectedTimeSlot,
        });

        // Create meeting request
        console.log('[Scheduling] DEBUG - Calling API with:', {
          teacherId: selectedTeacherId,
          timeSlot: selectedTimeSlot,
          reason,
        });
        
        const createResponse = await meetingAPI.createRequest(selectedTeacherId, selectedTimeSlot, reason);
        console.log('[Scheduling] DEBUG - API response:', createResponse);

        // Call the callback
        onSubmitRequest({
          day: selectedDate,
          time: selectedSlot,
          reason,
          teacher: selectedTeacher || '',
        });

        // Reset form
        setStep("calendar");
        setSelectedDate(null);
        setSelectedSlot(null);
        setReason("");
        setSelectedTeacher(null);
        setSelectedTeacherId(null);
        setShowCalendar(true);
      } catch (error: any) {
        console.error('[Scheduling] Error creating meeting request:', error);
        const errorMessage = error?.message || 'Failed to create meeting request. Please try again.';
        alert(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Missing required fields
      const missingFields = [];
      if (!selectedDate) missingFields.push('date');
      if (!selectedSlot) missingFields.push('time');
      if (!reason.trim()) missingFields.push('reason');
      if (!selectedTeacherId) missingFields.push('teacher');
      
      alert(`Please fill in all fields: ${missingFields.join(', ')}`);
    }
  };

  const handleBack = () => {
    if (step === "reason") {
      setShowCalendar(true);
      setStep("calendar");
    } else if (step === "teacher") {
      setStep("reason");
    }
  };

  const handleClose = () => {
    setStep("calendar");
    setSelectedDate(null);
    setSelectedSlot(null);
    setReason("");
    setSelectedTeacher(null);
    setSelectedTeacherId(null);
    setShowCalendar(true);
    onClose();
  };

  return (
    <>
      {/* Calendar Grid */}
      <SharedCalendarGrid
        isOpen={isOpen && showCalendar}
        onClose={handleClose}
        onSelectSlot={handleSlotSelect}
        mode={mode}
        currentSlot={
          existingRequest
            ? { day: existingRequest.day, time: existingRequest.time }
            : null
        }
        title={mode === "edit" ? "Reschedule Meeting" : "Select Time Slot"}
        description={
          mode === "edit"
            ? "Choose a new time for your meeting request"
            : "Pick an available time that works for you"
        }
      />

      {/* Reason and Teacher Selection Modal */}
      <AnimatePresence>
        {isOpen && !showCalendar && (
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
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="relative p-8 bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-xl border border-violet-500/30 rounded-3xl shadow-2xl">
                {/* Close button */}
                <motion.button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-white"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>

                {/* Progress indicator */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="h-1 w-16 bg-violet-500 rounded-full" />
                  <div
                    className={`h-1 rounded-full transition-all ${
                      step === "teacher" ? "bg-violet-500 w-16" : "bg-white/10 w-8"
                    }`}
                  />
                  <div
                    className={`h-1 rounded-full transition-all ${
                      step === "teacher" ? "bg-violet-500 w-16" : "bg-white/10 w-8"
                    }`}
                  />
                </div>

                {/* Header */}
                <motion.div className="mb-6 text-center">
                  <h2 className="text-2xl text-white mb-2">
                    {step === "reason" && "Meeting Details"}
                    {step === "teacher" && "Choose Instructor"}
                  </h2>
                  <p className="text-white/70">
                    {step === "reason" && "Tell us what you'd like to discuss"}
                    {step === "teacher" && "Select which instructor you'd like to meet"}
                  </p>
                </motion.div>

                <AnimatePresence mode="wait">
                  {/* Step 2: Reason Input */}
                  {step === "reason" && (
                    <motion.div
                      key="step-reason"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <div className="mb-6">
                        <label className="block text-sm text-white/80 mb-3">
                          Reason for this meeting
                        </label>
                        <motion.textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="E.g., Discuss project progress, clarify concepts, exam preparation..."
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-violet-500/50 focus:bg-white/10 transition-all outline-none resize-none"
                          rows={4}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        />
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          onClick={handleBack}
                          className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Back
                        </motion.button>
                        <motion.button
                          onClick={handleContinueToTeacher}
                          disabled={!reason.trim()}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl text-white hover:shadow-lg hover:shadow-violet-500/30 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: reason.trim() ? 1.02 : 1 }}
                          whileTap={{ scale: reason.trim() ? 0.98 : 1 }}
                        >
                          Continue
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Teacher Selection */}
                  {step === "teacher" && (
                    <motion.div
                      key="step-teacher"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <div className="space-y-3 mb-6">
                        {loadingTeachers ? (
                          <div className="text-center py-8 text-white/60">Loading teachers...</div>
                        ) : teachers.length === 0 ? (
                          <div className="text-center py-8 text-white/60">No teachers available</div>
                        ) : (
                          teachers.map((teacher, index) => (
                            <motion.button
                              key={teacher.id}
                              onClick={() => {
                                console.log('[Scheduling] ✅ VERIFY - Teacher selected:', { id: teacher.id, name: teacher.name, email: teacher.email });
                                setSelectedTeacher(teacher.name);
                                setSelectedTeacherId(teacher.id);
                              }}
                              className={`w-full p-5 rounded-xl border transition-all text-left ${
                                selectedTeacherId === teacher.id
                                  ? "bg-violet-500/20 border-violet-500 shadow-lg shadow-violet-500/20"
                                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                              }`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                                {teacher.avatar}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white mb-1">{teacher.name}</h4>
                                <p className="text-sm text-white/60">{teacher.department}</p>
                              </div>
                              {selectedTeacherId === teacher.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center"
                                >
                                  <User className="w-4 h-4 text-white" />
                                </motion.div>
                              )}
                            </div>
                          </motion.button>
                        ))
                        )}
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          onClick={handleBack}
                          className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Back
                        </motion.button>
                        <motion.button
                          onClick={handleSubmit}
                          disabled={!selectedTeacherId || isSubmitting}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl text-white hover:shadow-lg hover:shadow-violet-500/30 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          whileHover={{
                            scale: selectedTeacherId && !isSubmitting ? 1.02 : 1,
                          }}
                          whileTap={{
                            scale: selectedTeacherId && !isSubmitting ? 0.98 : 1,
                          }}
                        >
                          {isSubmitting ? (
                            <>
                              <motion.div
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              {mode === "edit" ? "Update Request" : "Send Request"}
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
