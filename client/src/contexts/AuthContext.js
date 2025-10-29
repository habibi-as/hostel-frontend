// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../utils/api"; // ✅ centralized axios instance

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
  const [token, setToken] = useState(localStorage.getItem("token"));

  // ✅ Fetch user when token changes
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await API.get("/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.user);
        } catch (error) {
          console.error("Auth check failed:", error);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  // ✅ Login (aligned with backend)
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });

      const { token: jwt, user: userData } = res.data;
      setUser(userData);
      setToken(jwt);
      localStorage.setItem("token", jwt);

      toast.success("Login successful!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Register (aligned with backend)
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await API.post("/auth/register", userData);

      toast.success(res.data.message || "Registration successful!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  };

  // ✅ Update Profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(profileData).forEach((key) => {
        if (profileData[key] !== null && profileData[key] !== undefined) {
          formData.append(key, profileData[key]);
        }
      });

      const res = await API.put("/auth/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser((prev) => ({ ...prev, ...res.data.user }));
      toast.success("Profile updated successfully!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Profile update failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Change Password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      await API.put(
        "/auth/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Password changed successfully!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Password change failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Forgot Password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await API.post("/auth/forgot-password", { email });
      toast.success("Password reset link sent to your email!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send reset email";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset Password
  const resetPassword = async (tokenParam, newPassword) => {
    try {
      setLoading(true);
      await API.post("/auth/reset-password", { token: tokenParam, newPassword });
      toast.success("Password reset successfully!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Password reset failed";
      toast.error(message);
      return { success: false, error: message };
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
    changePassword,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isStudent: user?.role === "student",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
