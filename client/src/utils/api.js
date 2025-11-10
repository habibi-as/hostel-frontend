import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://hostel-bobh.onrender.com/api";

const API = axios.create({
  baseURL: API_BASE_URL, // ✅ Only one /api prefix
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
