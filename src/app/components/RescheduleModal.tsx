import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle } from "lucide-react";
import { useState } from "react";
import { SharedCalendarGrid } from "./SharedCalendarGrid";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  onConfirm: (day: string, time: string) => void;
  currentSlot?: { day: string; time: string } | null;
}

export function RescheduleModal({
  isOpen,
  onClose,
  studentName,
  onConfirm,
  currentSlot,
}: RescheduleModalProps) {
  const [showCalendar, setShowCalendar] = useState(true);

  const handleSlotSelect = (day: string, time: string) => {
    setShowCalendar(false);
    setTimeout(() => {
      onConfirm(day, time);
      setShowCalendar(true);
    }, 300);
  };

  const handleClose = () => {
    setShowCalendar(true);
    onClose();
  };

  return (
    <SharedCalendarGrid
      isOpen={isOpen && showCalendar}
      onClose={handleClose}
      onSelectSlot={handleSlotSelect}
      mode="edit"
      currentSlot={currentSlot}
      title="Propose Alternative Time"
      description={`Suggest a new time slot for ${studentName}'s meeting request`}
    />
  );
}
