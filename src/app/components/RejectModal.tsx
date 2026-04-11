import { motion, AnimatePresence } from "motion/react";
import { X, XCircle, Calendar } from "lucide-react";
import { useState } from "react";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  onReject: (reason: string) => void;
  onReschedule: () => void;
}

export function RejectModal({
  isOpen,
  onClose,
  studentName,
  onReject,
  onReschedule,
}: RejectModalProps) {
  const [reason, setReason] = useState("");

  const handleReject = () => {
    if (reason.trim()) {
      onReject(reason);
    }
  };

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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="relative p-8 bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl border border-red-500/30 rounded-3xl">
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
              <div className="mb-6 text-center">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <XCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl text-white mb-2">Decline Request</h2>
                <p className="text-white/70">
                  How would you like to handle {studentName}'s request?
                </p>
              </div>

              {/* Options */}
              <div className="space-y-4 mb-6">
                {/* Option 1: Mark as Rejected */}
                <motion.div
                  className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-lg text-white mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    Decline with Reason
                  </h3>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explain why you're declining this request..."
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-red-500/50 focus:bg-white/10 transition-all outline-none resize-none"
                    rows={3}
                  />
                  <motion.button
                    onClick={handleReject}
                    disabled={!reason.trim()}
                    className="w-full mt-3 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white hover:shadow-lg hover:shadow-red-500/30 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: reason.trim() ? 1.02 : 1 }}
                    whileTap={{ scale: reason.trim() ? 0.98 : 1 }}
                  >
                    Send Decline Notice
                  </motion.button>
                </motion.div>

                {/* Option 2: Reschedule */}
                <motion.button
                  onClick={onReschedule}
                  className="w-full p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="text-lg text-white mb-2 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-violet-400" />
                    Propose Alternative Time
                  </h3>
                  <p className="text-sm text-white/60">
                    Suggest a different time slot that works better for you
                  </p>
                  <motion.div
                    className="mt-3 text-sm text-violet-400 flex items-center gap-2"
                  >
                    Click to reschedule →
                  </motion.div>
                </motion.button>
              </div>

              {/* Cancel button */}
              <motion.button
                onClick={onClose}
                className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
