import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://your-backend-name.onrender.com/api",
});

export default api;
