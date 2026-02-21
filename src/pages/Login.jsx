import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, error, loading } = useSelector((state) => state.auth);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning("Please fill all fields");
      return;
    }

    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (userInfo) {
      toast.success("Login Successful 🎉");

      if (userInfo.role === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/dashboard");
      }
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (error) {
      if (error.toLowerCase().includes("invalid")) {
        toast.error("Incorrect email or password");
      } else {
        toast.error(error);
      }
    }
  }, [error]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-100 to-purple-200">
      <form
        onSubmit={submitHandler}
        className="bg-white p-8 shadow-xl rounded-xl w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-3 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-700 text-white p-3 rounded hover:bg-purple-800 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
