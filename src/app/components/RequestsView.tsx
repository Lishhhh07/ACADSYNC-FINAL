import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Clock, User, Calendar, AlertCircle, X, Edit } from "lucide-react";
import { useState } from "react";
import { StudentSchedulingModal } from "./StudentSchedulingModal";

interface RequestsViewProps {
  onBack: () => void;
}

export function RequestsView({ onBack }: RequestsViewProps) {
  const [requests, setRequests] = useState([
    {
      id: 1,
      faculty: "Dr. Robert Smith",
      purpose: "Project Guidance",
      requestedTime: "Jan 4, 2:00 PM",
      day: "Mon",
      time: "02:00 PM",
      duration: "30 mins",
      status: "pending",
      avatar: "RS",
      submittedOn: "2 hours ago",
    },
    {
      id: 2,
      faculty: "Prof. Emily Johnson",
      purpose: "Course Query",
      requestedTime: "Jan 5, 10:00 AM",
      day: "Tue",
      time: "10:00 AM",
      duration: "20 mins",
      status: "pending",
      avatar: "EJ",
      submittedOn: "5 hours ago",
    },
    {
      id: 3,
      faculty: "Dr. Michael Chen",
      purpose: "Thesis Discussion",
      requestedTime: "Jan 5, 3:00 PM",
      day: "Wed",
      time: "03:00 PM",
      duration: "1 hour",
      status: "reviewing",
      avatar: "MC",
      submittedOn: "1 day ago",
    },
  ]);

  const [removingId, setRemovingId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [editingRequest, setEditingRequest] = useState<any>(null);

  const handleCancelRequest = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      setRequests(requests.filter((r) => r.id !== id));
      setRemovingId(null);
      setToastMessage("Request cancelled successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 500);
  };

  const handleEditRequest = (request: any) => {
    setEditingRequest({
      day: request.day,
      time: request.time,
      reason: request.purpose,
      teacher: request.faculty,
    });
  };

  const handleUpdateRequest = (data: any) => {
    setEditingRequest(null);
    setToastMessage("Request updated successfully");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#0f0322] to-[#1a0b2e] dark">
      {/* Ambient background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-500/20 rounded-full blur-[150px]"
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
            <Clock className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-xl text-white">Pending Requests</h1>
              <p className="text-xs text-white/60">Track your meeting requests</p>
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
          <h2 className="text-3xl text-white mb-2">Your Requests</h2>
          <p className="text-white/60">You have {requests.length} pending requests</p>
        </motion.div>

        {/* Info banner */}
        <motion.div
          className="mb-8 p-4 bg-yellow-500/10 backdrop-blur-xl border border-yellow-500/20 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm text-yellow-400 mb-1">Awaiting Faculty Response</h4>
              <p className="text-xs text-white/60">
                Your requests are being reviewed by faculty. You'll be notified once they respond.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Requests list */}
        <div className="grid gap-6">
          {requests.map((request, index) => (
            <motion.div
              key={request.id}
              className="group relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.01, y: -2 }}
            >
              {/* Animated border pulse */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(234, 179, 8, 0)",
                    "0 0 20px rgba(234, 179, 8, 0.2)",
                    "0 0 0px rgba(234, 179, 8, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />

              <div className="relative z-10 flex items-start gap-4">
                {/* Avatar */}
                <motion.div
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0 text-white shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {request.avatar}
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg text-white mb-1 flex items-center gap-2">
                        {request.faculty}
                        <motion.span
                          className={`px-2 py-1 rounded-md text-xs ${
                            request.status === "pending"
                              ? "bg-yellow-500/20 border border-yellow-500/30 text-yellow-400"
                              : "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                        >
                          {request.status === "pending" ? "Pending" : "Reviewing"}
                        </motion.span>
                      </h3>
                      <p className="text-sm text-white/70">{request.purpose}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-white/60 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-yellow-400" />
                      <span className="text-white/80">{request.requestedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-white/80">Duration: {request.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-yellow-400" />
                      <span className="text-white/80">Submitted {request.submittedOn}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => handleEditRequest(request)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-sm text-cyan-400 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-sm">Edit Request</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleCancelRequest(request.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm text-red-400 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm">Cancel Request</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                style={{ transform: "skewX(-20deg)" }}
              />

              {/* Fade out animation */}
              {removingId === request.id && (
                <motion.div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-white">Cancelling...</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty state message if needed */}
        {requests.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Clock className="w-16 h-16 mx-auto mb-4 text-white/40" />
            <h3 className="text-xl text-white mb-2">No Pending Requests</h3>
            <p className="text-white/60">You don't have any pending meeting requests at the moment.</p>
          </motion.div>
        )}
      </main>

      {/* Edit Request Modal */}
      <StudentSchedulingModal
        isOpen={!!editingRequest}
        onClose={() => setEditingRequest(null)}
        onSubmitRequest={handleUpdateRequest}
        mode="edit"
        existingRequest={editingRequest}
      />

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-green-500/20 to-cyan-500/20 backdrop-blur-xl border border-green-500/30 rounded-xl shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <p className="text-white">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}