import axios from "axios";

const api = axios.create({
  baseURL: "https://hostel-backend-asurax.onrender.com/api",
  withCredentials: true,
});

export default api;
