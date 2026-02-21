import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import PrivateRoute from "./components/PrivateRoute";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import Profile from "./pages/Profile";

function App() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <Router>
      {/* 🔔 Premium Toast Setup */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(30, 41, 59, 0.9)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: {
            style: {
              background: "rgba(22, 163, 74, 0.9)",
            },
          },
          error: {
            style: {
              background: "rgba(220, 38, 38, 0.9)",
            },
          },
        }}
      />

      <Routes>

        {/* ================= AUTH PAGE ================= */}
        <Route
          path="/"
          element={
            userInfo ? (
              userInfo.role === "doctor" ? (
                <Navigate to="/doctor" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Auth />
            )
          }
        />

        {/* ================= PROFILE (COMMON FOR BOTH) ================= */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* ================= PATIENT ROUTES ================= */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role="patient">
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <PrivateRoute role="patient">
              <MyAppointments />
            </PrivateRoute>
          }
        />

        <Route
          path="/book"
          element={
            <PrivateRoute role="patient">
              <BookAppointment />
            </PrivateRoute>
          }
        />

        {/* ================= DOCTOR ROUTES ================= */}
        <Route
          path="/doctor"
          element={
            <PrivateRoute role="doctor">
              <DoctorDashboard />
            </PrivateRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
