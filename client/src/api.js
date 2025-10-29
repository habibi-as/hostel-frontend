import axios from "axios";

const api = axios.create({
  baseURL: "https://hostel-bobh.onrender.com/api",
  withCredentials: true,
});

export default api;
