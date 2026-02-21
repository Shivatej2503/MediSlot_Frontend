import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import AppointmentDetailsModal from "../components/AppointmentDetailsModal";
import {
  getAppointments,
  deleteAppointment,
} from "../features/appointments/appointmentSlice";

const MyAppointments = () => {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector(
    (state) => state.appointments
  );

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    dispatch(getAppointments());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await dispatch(deleteAppointment(id));
    toast.success("Appointment cancelled");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8 text-purple-800">
        My Appointments
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-6">
          {appointments?.map((appt) => (
            <motion.div
              key={appt._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl shadow-lg flex justify-between items-center hover:shadow-xl transition"
            >
              <div
                onClick={() => setSelectedAppointment(appt)}
                className="cursor-pointer"
              >
                <h3 className="font-semibold text-lg text-purple-700">
                  Dr. {appt.doctor?.name}
                </h3>
                <p>{appt.date} at {appt.time}</p>
              </div>

              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                    appt.status
                  )}`}
                >
                  {appt.status}
                </span>

                {appt.status === "pending" && (
                  <button
                    onClick={() => handleDelete(appt._id)}
                    className="block mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AppointmentDetailsModal
        open={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />
    </DashboardLayout>
  );
};

export default MyAppointments;
