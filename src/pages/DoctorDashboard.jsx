import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import AppointmentDetailsModal from "../components/AppointmentDetailsModal";
import {
  getAppointments,
  updateStatus,
  deleteAppointment,
} from "../features/appointments/appointmentSlice";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector(
    (state) => state.appointments
  );

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    dispatch(getAppointments());
  }, [dispatch]);

  const stats = useMemo(() => ({
    total: appointments?.length || 0,
    pending: appointments?.filter(a => a.status === "pending").length || 0,
    approved: appointments?.filter(a => a.status === "approved").length || 0,
    rejected: appointments?.filter(a => a.status === "rejected").length || 0,
  }), [appointments]);

  const handleStatus = async (id, status) => {
    await dispatch(updateStatus({ id, status }));
    toast.success(`Appointment ${status}`);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteAppointment(id));
    toast.success("Appointment deleted");
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard title="Total" value={stats.total} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Approved" value={stats.approved} />
        <StatCard title="Rejected" value={stats.rejected} />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="pb-3">Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments?.map((appt) => (
                <motion.tr
                  key={appt._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b hover:bg-purple-50 transition"
                >
                  <td
                    onClick={() => setSelectedAppointment(appt)}
                    className="py-3 font-medium text-purple-700 cursor-pointer"
                  >
                    {appt.patient?.name}
                  </td>
                  <td>{appt.date}</td>
                  <td>{appt.time}</td>
                  <td>
                    <select
                      value={appt.status}
                      onChange={(e) =>
                        handleStatus(appt._id, e.target.value)
                      }
                      className="border px-2 py-1 rounded-lg"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => handleDelete(appt._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AppointmentDetailsModal
        open={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />
    </DashboardLayout>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow text-center">
    <h3 className="text-gray-500">{title}</h3>
    <p className="text-3xl font-bold text-purple-700">{value}</p>
  </div>
);

export default DoctorDashboard;
