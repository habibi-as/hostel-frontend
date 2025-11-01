// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../utils/api"; // centralized axios instance

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // ✅ Auto-login if token exists
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.user) {
          setUser(res.data.user);
          API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          logout();
        }
      } catch (error) {
        console.warn("Auth check failed:", error?.response?.data || error.message);
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [token]);

  // ✅ Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await API.post("/api/auth/login", { email, password });

      if (res.data.success) {
        const { token: jwt, user: userData } = res.data;
        setUser(userData);
        setToken(jwt);
        localStorage.setItem("token", jwt);
        localStorage.setItem("user", JSON.stringify(userData));
        API.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
        toast.success(`${userData.role} login successful!`);
        return { success: true, user: userData };
      } else {
        toast.error(res.data.message || "Login failed");
        return { success: false };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Register
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await API.post("/api/auth/register", userData);
      toast.success(res.data.message || "Registration successful!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete API.defaults.headers.common["Authorization"];
  };

  // ✅ Update Profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const res = await API.put("/api/auth/profile", profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser((prev) => ({ ...prev, ...res.data.user }));
      toast.success("Profile updated successfully!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Forgot Password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await API.post("/api/auth/forgot-password", { email });
      toast.success("Password reset link sent!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset Password
  const resetPassword = async (tokenParam, newPassword) => {
    try {
      setLoading(true);
      await API.post("/api/auth/reset-password", { token: tokenParam, newPassword });
      toast.success("Password reset successfully!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isStudent: user?.role === "student",
    isWarden: user?.role === "warden",
  };

  // ✅ Prevent blank screen during loading
  if (loading) return <div className="text-center p-10 text-lg">Loading...</div>;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
