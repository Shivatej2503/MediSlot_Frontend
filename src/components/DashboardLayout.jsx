import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

const DashboardLayout = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // ✅ fixed redirect
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-72 bg-gradient-to-b from-purple-700 to-purple-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-purple-600">
          <h2 className="text-xl font-bold">Doctor Appointment</h2>
        </div>

        <div className="p-6 border-b border-purple-600">
          <h3 className="font-semibold">{userInfo?.name}</h3>
          <p className="text-sm text-purple-200 capitalize">
            {userInfo?.role}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {userInfo?.role === "patient" && (
            <>
              <NavLink to="/dashboard" className={navStyle}>
                Dashboard
              </NavLink>
              <NavLink to="/book" className={navStyle}>
                Book Appointment
              </NavLink>
              <NavLink to="/appointments" className={navStyle}>
                My Appointments
              </NavLink>
              <NavLink to="/profile" className={navStyle}>
                Profile
              </NavLink>
            </>
          )}

          {userInfo?.role === "doctor" && (
            <>
              <NavLink to="/doctor" className={navStyle}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={navStyle}>
                Profile
              </NavLink>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-purple-600">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">{children}</main>
    </div>
  );
};

const navStyle = ({ isActive }) =>
  `block px-4 py-2 rounded-lg transition ${
    isActive ? "bg-purple-600" : "hover:bg-purple-600"
  }`;

export default DashboardLayout;
