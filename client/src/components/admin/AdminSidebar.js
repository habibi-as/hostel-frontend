// src/components/admin/AdminSidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FaHome,
  FaUsers,
  FaBed,
  FaDollarSign,
  FaExclamationTriangle,
  FaBullhorn,
  FaSearch,
  FaComments,
  FaQrcode,
  FaChartBar,
  FaUser,
  FaSun,
  FaMoon,
  FaTimes,
} from "react-icons/fa";

const AdminSidebar = ({ onClose }) => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: FaHome },
    { name: "Students", href: "/admin/students", icon: FaUsers },
    { name: "Rooms", href: "/admin/rooms", icon: FaBed },
    { name: "Fees", href: "/admin/fees", icon: FaDollarSign },
    { name: "Complaints", href: "/admin/complaints", icon: FaExclamationTriangle },
    { name: "Notices", href: "/admin/notices", icon: FaBullhorn },
    { name: "Lost & Found", href: "/admin/lost-found", icon: FaSearch },
    { name: "Chat", href: "/admin/chat", icon: FaComments },
    { name: "Attendance", href: "/admin/attendance", icon: FaQrcode },
    { name: "Reports", href: "/admin/reports", icon: FaChartBar },
    { name: "Profile", href: "/admin/profile", icon: FaUser },
  ];

  // 🔍 Helper to match active routes (even for dynamic URLs)
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div
      className={`h-full flex flex-col transition-colors duration-300 ${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      } border-r border-gray-200 dark:border-gray-700`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <span className="ml-2 text-xl font-bold">HostelHub</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          aria-label="Close sidebar"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className={`mr-3 w-5 h-5 ${
                  active ? "text-blue-600 dark:text-blue-300" : "text-gray-400"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle + Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleDarkMode}
          className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
        >
          {darkMode ? (
            <>
              <FaSun className="mr-3 w-5 h-5 text-yellow-400" />
              Light Mode
            </>
          ) : (
            <>
              <FaMoon className="mr-3 w-5 h-5 text-indigo-400" />
              Dark Mode
            </>
          )}
        </button>
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>HostelHub Admin Panel</p>
          <p className="text-gray-400 dark:text-gray-500">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;

