import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token;

  // ✅ Axios default config
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // ✅ Login function (used in your Login.js)
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password }
      );

      if (res.data.success) {
        const { token, user } = res.data;

        setToken(token);
        setUser(user);

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return { success: true, user };
      } else {
        toast.error(res.data.message || "Login failed");
        return { success: false };
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error(err.response?.data?.message || "Invalid email or password");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logged out successfully!");
  };

  const value = {
    token,
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
