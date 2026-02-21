import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  // 🚫 Not logged in → go to Auth
  if (!userInfo) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 🔐 Role-based protection
  if (role && userInfo.role !== role) {
    // Redirect user to their correct dashboard
    if (userInfo.role === "doctor") {
      return <Navigate to="/doctor" replace />;
    }

    if (userInfo.role === "patient") {
      return <Navigate to="/dashboard" replace />;
    }

    // Unknown role fallback
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized
  return children;
};

export default PrivateRoute;
