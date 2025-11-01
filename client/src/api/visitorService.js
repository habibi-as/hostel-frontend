import axios from "axios";

// ✅ Set your base API URL — only one `/api` added here
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/visitors`;

// ✅ Get all visitors
export const getVisitors = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// ✅ Add visitor
export const addVisitor = async (token, data) => {
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// ✅ Checkout visitor
export const checkoutVisitor = async (token, id) => {
  const res = await axios.put(`${API_URL}/${id}/checkout`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// ✅ Delete visitor
export const deleteVisitor = async (token, id) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
