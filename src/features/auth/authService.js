import axios from "../../utils/axios";

const login = async (userData) => {
  const response = await axios.post("/auth/login", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const register = async (userData) => {
  const response = await axios.post("/auth/register", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const authService = {
  login,
  register,
};

export default authService;
