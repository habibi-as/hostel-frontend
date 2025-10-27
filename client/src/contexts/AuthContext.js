// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../utils/api"; // ✅ Using centralized API config

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

  // ✅ Fetch user when app starts or token changes
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await API.get("/auth/me");
          setUser(response.data.data);
        } catch (error) {
          console.error("Auth check failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // ✅ Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await API.post("/auth/login", { email, password });

      const { user: userData, token: userToken } = response.data.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem("token", userToken);

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

  // ✅ Register
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await API.post("/auth/register", userData);

      const { user: newUser, token: userToken } = response.data.data;
      setUser(newUser);
      setToken(userToken);
      localStorage.setItem("token", userToken);

      toast.success("Registration successful!");
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

      await API.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser((prev) => ({ ...prev, ...profileData }));
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
      await API.put("/auth/change-password", { currentPassword, newPassword });

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
  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      await API.post("/auth/reset-password", { token, newPassword });
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
