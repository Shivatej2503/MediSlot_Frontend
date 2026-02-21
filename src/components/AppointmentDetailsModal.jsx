import { motion, AnimatePresence } from "framer-motion";

const AppointmentDetailsModal = ({ open, onClose, appointment }) => {
  if (!appointment) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 40, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-purple-700 mb-6">
              Appointment Details
            </h2>

            <div className="space-y-3 text-gray-700">
              <p><strong>Date:</strong> {appointment.date}</p>
              <p><strong>Time:</strong> {appointment.time}</p>
              <p><strong>Duration:</strong> {appointment.duration || "15 mins"}</p>
              <p><strong>Status:</strong> {appointment.status}</p>
              <p><strong>Reason:</strong></p>
              <div className="bg-purple-50 p-3 rounded-lg text-sm">
                {appointment.reason || "No reason provided"}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppointmentDetailsModal;
