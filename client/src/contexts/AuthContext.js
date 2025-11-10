import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../utils/api"; // centralized axios instance

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // ✅ Auto-login if token exists
  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // ✅ Correct endpoint (no extra /api)
        const res = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.success && res.data.user) {
          setUser(res.data.user);
          API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          console.warn("No user found in /auth/profile response");
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

  // ✅ Login
  const login = async (email, password) => {
    try {
      setLoading(true);

      // ✅ FIXED: removed the extra /api
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

  // ✅ Logout
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
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isStudent: user?.role === "student",
    isWarden: user?.role === "warden",
  };

  // ✅ Prevent flicker during auth check
  if (loading)
    return (
      <div className="text-center p-10 text-lg">
        Checking authentication...
      </div>
    );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
