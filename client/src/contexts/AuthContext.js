import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Restore token & user from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      API.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  // ✅ Verify token if present
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
        } else {
          logout();
        }
      } catch (err) {
        console.warn("Auth check failed:", err?.response?.data || err.message);
        logout();
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

  // ✅ Register function
  const register = async (formData) => {
    try {
      setLoading(true);
      const res = await API.post("/auth/register", formData);

      if (res.data.success) {
        toast.success("Registration successful!");
        return { success: true, message: "Registered successfully" };
      } else {
        toast.error(res.data.message || "Registration failed");
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
      return { success: false, message: "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete API.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isStudent: user?.role === "student",
  };

  if (loading) {
    return (
      <div className="text-center p-10 text-lg text-gray-600 dark:text-gray-300">
        Checking authentication...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
