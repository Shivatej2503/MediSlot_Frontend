import axios from "axios";

const API = axios.create({
  baseURL: "https://medislot-backend-kgy1.onrender.com/api",
});

// 🔐 Attach token to every request
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo) {
      const token = JSON.parse(userInfo).token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Auto logout on 401 (token expired)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }

    return Promise.reject(
      error.response?.data?.message || error.message
    );
  }
);

export default API;

