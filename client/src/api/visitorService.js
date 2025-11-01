import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/visitors`;

export const getVisitors = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const addVisitor = async (token, data) => {
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const checkoutVisitor = async (token, id) => {
  const res = await axios.put(`${API_URL}/${id}/checkout`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const deleteVisitor = async (token, id) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
