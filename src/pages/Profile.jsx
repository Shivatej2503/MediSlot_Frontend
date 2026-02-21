import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      setFormData({ ...formData, avatar: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSave = () => {
    toast.success("Profile updated successfully");
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-purple-700">
          Update Profile
        </h2>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-purple-100 overflow-hidden">
            {preview ? (
              <img src={preview} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-purple-600 text-xl">
                👤
              </div>
            )}
          </div>

          <input
            type="file"
            name="avatar"
            onChange={handleChange}
            className="text-sm"
          />
        </div>

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg"
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="w-full p-3 mb-6 border rounded-lg"
        />

        <button
          onClick={handleSave}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg transition"
        >
          Save Changes
        </button>
      </motion.div>
    </DashboardLayout>
  );
};

export default Profile;
