import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";


const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "patient",
  });

  const [error, setError] = useState("");

  const { name, email, password, phone, role } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !phone) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      await axios.post("https://medislot-backend-kgy1.onrender.com/api/auth/register", formData);

      toast.success("Account created successfully 🎉");
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong";

      toast.error(message);
      setError(message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="bg-white p-8 rounded-xl shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Register
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={name}
            onChange={handleChange}
            className="w-full mb-4 px-3 py-3 border rounded focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            className="w-full mb-4 px-3 py-3 border rounded focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={phone}
            onChange={handleChange}
            className="w-full mb-4 px-3 py-3 border rounded focus:ring-2 focus:ring-blue-400"
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              className="w-full px-3 py-3 border rounded focus:ring-2 focus:ring-blue-400"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <select
            name="role"
            value={role}
            onChange={handleChange}
            className="w-full mb-4 px-3 py-3 border rounded focus:ring-2 focus:ring-blue-400"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

