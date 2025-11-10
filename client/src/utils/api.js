import axios from "axios";

// ✅ Define the API base URL — includes `/api` only once
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://hostel-bobh.onrender.com/api";

// 🔍 Warn if environment variable missing (helps debugging)
if (!API_BASE_URL) {
  console.error("❌ REACT_APP_API_URL not defined in .env file");
}

// ✅ Create Axios instance
const API = axios.create({
  baseURL: API_BASE_URL, // all requests will start with /api
  headers: { "Content-Type": "application/json" },
});

// ✅ Automatically attach JWT token to every request (if available)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Global error handling for expired or invalid tokens
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // redirect to login page
    }
    return Promise.reject(error);
  }
);

export default API;
