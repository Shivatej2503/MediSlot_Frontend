import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../components/DashboardLayout";
import {
  getAppointments,
  deleteAppointment,
} from "../features/appointments/appointmentSlice";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { appointments, loading } = useSelector(
    (state) => state.appointments
  );

  useEffect(() => {
    dispatch(getAppointments());
  }, [dispatch]);

  const stats = useMemo(() => {
    return {
      total: appointments?.length || 0,
      pending: appointments?.filter((a) => a.status === "pending").length || 0,
      approved:
        appointments?.filter((a) => a.status === "approved").length || 0,
      rejected:
        appointments?.filter((a) => a.status === "rejected").length || 0,
    };
  }, [appointments]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Appointment?",
      text: "Are you sure you want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel",
    });

    if (result.isConfirmed) {
      const response = await dispatch(deleteAppointment(id));

      if (!response.error) {
        toast.success("Appointment cancelled successfully");
        dispatch(getAppointments());
      } else {
        toast.error(response.payload || "Cancel failed");
      }
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {userInfo?.name}
          </h1>
          <p className="text-gray-500 mt-1">
            Here’s a summary of your appointments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total" value={stats.total} />
          <StatCard title="Pending" value={stats.pending} />
          <StatCard title="Approved" value={stats.approved} />
          <StatCard title="Rejected" value={stats.rejected} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">
            Recent Appointments
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : appointments.length === 0 ? (
            <p className="text-gray-500">No appointments yet.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <div
                  key={appt._id}
                  className="flex justify-between items-center border rounded-xl p-4 hover:shadow-md transition"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Dr. {appt.doctor?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(appt.date)} at {appt.time}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <StatusBadge status={appt.status} />

                    {appt.status === "pending" && (
                      <button
                        onClick={() => handleDelete(appt._id)}
                        className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm">
    <p className="text-gray-500 text-sm">{title}</p>
    <h3 className="text-3xl font-bold text-purple-700 mt-2">{value}</h3>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
};

export default Dashboard;
