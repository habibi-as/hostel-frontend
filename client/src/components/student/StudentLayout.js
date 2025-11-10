// src/components/student/StudentLayout.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";

const StudentLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Prevent body scroll when sidebar is open on mobile
  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [sidebarOpen]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="navigation"
        aria-label="Student Sidebar"
      >
        <StudentSidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main Content Wrapper */}
      <div className="lg:ml-64 flex flex-col min-h-screen relative">
        {/* Navbar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
          <StudentNavbar
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            user={user}
            onLogout={handleLogout}
            aria-expanded={sidebarOpen}
          />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        {/* Footer (optional, nice touch) */}
        <footer className="text-center text-xs py-4 opacity-70 dark:text-gray-400">
          © {new Date().getFullYear()} Hostel Management Portal
        </footer>
      </div>
    </div>
  );
};

export default StudentLayout;
