import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // ⏳ Wait for AuthContext to finish checking token
  if (loading) return null;

  // 🚫 Not logged in → send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ⚠️ Role mismatch → redirect to correct dashboard
  if (role && user?.role !== role) {
    const redirectPath =
      user?.role === "admin"
        ? "/admin/dashboard"
        : user?.role === "student"
        ? "/student/dashboard"
        : "/";
    return <Navigate to={redirectPath} replace />;
  }

  // ✅ Access granted
  return children;
};

export default ProtectedRoute;

