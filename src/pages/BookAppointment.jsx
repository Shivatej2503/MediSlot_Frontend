import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import {
  fetchDoctors,
  bookAppointment,
  getAppointments,
} from "../features/appointments/appointmentSlice";

const BookAppointment = () => {
  const dispatch = useDispatch();

  const { doctors, appointments, loading } = useSelector(
    (state) => state.appointments
  );

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(15);
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(getAppointments());
  }, [dispatch]);

  // 🕒 Generate 15-min slots (9AM – 5PM)
  const generateTimeSlots = () => {
    const slots = [];
    let start = 9 * 60;
    let end = 17 * 60;

    for (let time = start; time < end; time += 15) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      const formatted = new Date(0, 0, 0, hours, minutes)
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      slots.push(formatted);
    }
    return slots;
  };

  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // 🚫 Disable already booked slots
  const isSlotBooked = (slot) => {
    return appointments?.some(
      (appt) =>
        appt.doctor === selectedDoctor &&
        appt.date === selectedDate &&
        appt.time === slot
    );
  };

  const handleConfirmBooking = async () => {
    const result = await dispatch(
      bookAppointment({
        doctor: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        reason,
      })
    );

    if (!result.error) {
      toast.success("Appointment booked successfully 🎉");
      dispatch(getAppointments());
      setShowModal(false);
      resetForm();
    } else {
      toast.error(result.payload || "Booking failed");
    }
  };

  const resetForm = () => {
    setSelectedDoctor("");
    setSelectedDate("");
    setSelectedTime("");
    setDuration(15);
    setReason("");
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6 text-purple-700">
          Book Appointment
        </h1>

        <div className="backdrop-blur-lg bg-white/30 border border-white/40 shadow-xl rounded-2xl p-8">
          
          {/* Doctor Select */}
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg border"
          >
            <option value="">Select Doctor</option>
            {doctors?.map((doc) => (
              <option key={doc._id} value={doc._id}>
                Dr. {doc.name}
              </option>
            ))}
          </select>

          {/* Date */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg border"
          />

          {/* Duration */}
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full p-3 mb-6 rounded-lg border"
          >
            <option value={15}>15 Minutes</option>
            <option value={30}>30 Minutes</option>
            <option value={45}>45 Minutes</option>
            <option value={60}>1 Hour</option>
          </select>

          {/* Time Grid */}
          {selectedDoctor && selectedDate && (
            <>
              <h2 className="text-lg font-semibold mb-3">
                Available Time Slots
              </h2>

              <div className="grid grid-cols-4 gap-3">
                {timeSlots.map((slot, index) => {
                  const booked = isSlotBooked(slot);

                  return (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.9 }}
                      disabled={booked}
                      onClick={() => setSelectedTime(slot)}
                      className={`p-2 rounded-lg text-sm font-medium transition
                        ${
                          booked
                            ? "bg-red-400 text-white cursor-not-allowed"
                            : selectedTime === slot
                            ? "bg-purple-700 text-white"
                            : "bg-gray-200 hover:bg-purple-200"
                        }
                      `}
                    >
                      {slot}
                    </motion.button>
                  );
                })}
              </div>
            </>
          )}

          {/* Reason */}
          <textarea
            placeholder="Reason for appointment"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full mt-6 p-3 rounded-lg border"
          />

          {/* Book Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            disabled={!selectedTime || loading}
            onClick={() => setShowModal(true)}
            className="w-full mt-6 bg-purple-700 text-white py-3 rounded-lg"
          >
            {loading ? "Processing..." : "Continue"}
          </motion.button>
        </div>
      </motion.div>

      {/* Booking Summary Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-2xl p-8 w-96 shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-4">
                Confirm Booking
              </h2>

              <p><strong>Doctor:</strong> {
                doctors.find(d => d._id === selectedDoctor)?.name
              }</p>
              <p><strong>Date:</strong> {selectedDate}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Duration:</strong> {duration} Minutes</p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="px-4 py-2 rounded bg-purple-700 text-white"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
};

export default BookAppointment;
