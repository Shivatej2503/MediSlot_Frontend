import axios from "axios";

const API = axios.create({
  baseURL: "https://medislot-backend-kgy1.onrender.com/",
});

// Add token automatically if exists
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }

  return req;
});

export default API;
