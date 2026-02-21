import API from "../../utils/axios";

// ================= GET APPOINTMENTS =================
const getAppointments = async () => {
  const { data } = await API.get("/appointments");
  return data;
};

// ================= GET DOCTORS =================
const getDoctors = async () => {
  const { data } = await API.get("/users/doctors");
  return data;
};

// ================= BOOK APPOINTMENT =================
const bookAppointment = async (appointmentData) => {
  const { data } = await API.post("/appointments", appointmentData);
  return data;
};

// ================= UPDATE STATUS =================
const updateStatus = async ({ id, status }) => {
  const { data } = await API.put(`/appointments/${id}/status`, { status });
  return data;
};

// ================= DELETE =================
const deleteAppointment = async (id) => {
  const { data } = await API.delete(`/appointments/${id}`);
  return data;
};

const appointmentService = {
  getAppointments,
  getDoctors,
  bookAppointment,
  updateStatus,
  deleteAppointment,
};

export default appointmentService;
