import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, error, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "patient",
  });

  const { name, email, password, phone, role } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://medislot-backend-kgy1.onrender.com/api/auth/register", formData);
      toast.success("Account created successfully 🎉");
      setIsLogin(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  // ================= LOGIN =================
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  // ================= FORGOT PASSWORD =================
  const handleForgot = async (e) => {
    e.preventDefault();
    toast.success("Password reset link sent (Demo UI)");
    setForgotMode(false);
  };

  // ================= REDIRECT =================
  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/dashboard");
      }
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (error) {
      toast.error("Incorrect email or password");
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-3xl w-full max-w-md p-8 text-white"
      >

        {/* Toggle */}
        {!forgotMode && (
          <div className="flex mb-6 bg-white/20 rounded-full p-1">
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 rounded-full transition ${
                !isLogin ? "bg-white text-indigo-700" : "text-white"
              }`}
            >
              Register
            </button>

            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 rounded-full transition ${
                isLogin ? "bg-white text-indigo-700" : "text-white"
              }`}
            >
              Login
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.form
            key={forgotMode ? "forgot" : isLogin ? "login" : "register"}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            onSubmit={
              forgotMode
                ? handleForgot
                : isLogin
                ? handleLogin
                : handleRegister
            }
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              {forgotMode
                ? "Reset Password"
                : isLogin
                ? "Welcome Back"
                : "Create Account"}
            </h2>

            {!isLogin && !forgotMode && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={name}
                  onChange={handleChange}
                  className="w-full mb-4 p-3 rounded-lg bg-white/30 placeholder-white focus:outline-none"
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={phone}
                  onChange={handleChange}
                  className="w-full mb-4 p-3 rounded-lg bg-white/30 placeholder-white focus:outline-none"
                />
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              className="w-full mb-4 p-3 rounded-lg bg-white/30 placeholder-white focus:outline-none"
            />

            {!forgotMode && (
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/30 placeholder-white focus:outline-none"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            )}

            {!isLogin && !forgotMode && (
              <select
                name="role"
                value={role}
                onChange={handleChange}
                className="w-full mb-4 p-3 rounded-lg bg-white/30 text-white"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-white text-indigo-700 font-semibold hover:scale-105 transition"
            >
              {loading
                ? "Please wait..."
                : forgotMode
                ? "Send Reset Link"
                : isLogin
                ? "Login"
                : "Register"}
            </button>

            {isLogin && !forgotMode && (
              <p
                onClick={() => setForgotMode(true)}
                className="text-sm mt-4 text-center cursor-pointer underline"
              >
                Forgot Password?
              </p>
            )}

            {forgotMode && (
              <p
                onClick={() => setForgotMode(false)}
                className="text-sm mt-4 text-center cursor-pointer underline"
              >
                Back to Login
              </p>
            )}
          </motion.form>
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default Auth;

