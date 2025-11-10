// src/components/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // ⏳ While verifying auth token — show spinner instead of blank page
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // 🚫 Not logged in → redirect to login (save intended route)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ⚠️ Role mismatch → redirect to correct dashboard
  if (role && user?.role !== role) {
    const redirectPath =
      user?.role === "admin"
        ? "/admin"
        : user?.role === "student"
        ? "/student"
        : "/";
    return <Navigate to={redirectPath} replace />;
  }

  // ✅ Access granted
  return children;
};

export default ProtectedRoute;


