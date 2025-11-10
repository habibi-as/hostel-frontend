// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../utils/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // ✅ Verify token on initial load only if not already verified
  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/auth/profile");
        if (res.data?.success && res.data.user) {
          setUser(res.data.user);
          API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          console.warn("⚠️ Invalid auth response, logging out");
          handleLogout(false);
        }
      } catch (err) {
        console.warn("Auth verify error:", err?.response?.data || err.message);
        handleLogout(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token]);

  // ✅ Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });

      if (res.data?.success) {
        const { token: jwt, user: userData } = res.data;

        // Store credentials
        setUser(userData);
        setToken(jwt);
        localStorage.setItem("token", jwt);
        localStorage.setItem("user", JSON.stringify(userData));
        API.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

        toast.success(`${userData.role.toUpperCase()} login successful`);
        return { success: true, user: userData };
      } else {
        toast.error(res.data?.message || "Invalid credentials");
        return { success: false };
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Centralized logout handler
  const handleLogout = (showToast = true) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete API.defaults.headers.common["Authorization"];
    if (showToast) toast("Logged out successfully");
  };

  // ✅ Role utilities
  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";
  const isWarden = user?.role === "warden";

  const value = {
    user,
    token,
    loading,
    login,
    logout: handleLogout,
    isAuthenticated,
    isAdmin,
    isStudent,
    isWarden,
  };

  // ✅ Avoid flicker during verification
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 dark:text-gray-300">
        Checking authentication...
      </div>
    );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
