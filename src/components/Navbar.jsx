import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-purple-700 text-white p-4 flex justify-between">
      <h1 className="font-bold text-lg">Doctor Appointment</h1>

      <div className="space-x-4">
        {!userInfo ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            {userInfo.role === "patient" && (
              <Link to="/dashboard">Dashboard</Link>
            )}

            {userInfo.role === "doctor" && (
              <Link to="/doctor">Doctor Panel</Link>
            )}

            <button onClick={handleLogout} className="ml-3">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
