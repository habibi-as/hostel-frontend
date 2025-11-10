// src/components/student/StudentSidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FaHome,
  FaUser,
  FaQrcode,
  FaDollarSign,
  FaBullhorn,
  FaExclamationTriangle,
  FaSearch,
  FaComments,
  FaUtensils,
  FaTshirt,
  FaUserFriends,
  FaWrench,
  FaCalendarAlt,
  FaStar,
  FaSun,
  FaMoon,
  FaTimes,
} from "react-icons/fa";

const StudentSidebar = ({ onClose }) => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

  const navigation = [
    { name: "Dashboard", href: "/student", icon: FaHome },
    { name: "Profile", href: "/student/profile", icon: FaUser },
    { name: "Attendance", href: "/student/attendance", icon: FaQrcode },
    { name: "Fees", href: "/student/fees", icon: FaDollarSign },
    { name: "Notices", href: "/student/notices", icon: FaBullhorn },
    { name: "Complaints", href: "/student/complaints", icon: FaExclamationTriangle },
    { name: "Lost & Found", href: "/student/lost-found", icon: FaSearch },
    { name: "Chat", href: "/student/chat", icon: FaComments },
    { name: "Food Menu", href: "/student/food-menu", icon: FaUtensils },
    { name: "Laundry", href: "/student/laundry", icon: FaTshirt },
    { name: "Visitors", href: "/student/visitors", icon: FaUserFriends },
    { name: "Maintenance", href: "/student/maintenance", icon: FaWrench },
    { name: "Events", href: "/student/events", icon: FaCalendarAlt },
    { name: "Feedback", href: "/student/feedback", icon: FaStar },
  ];

  return (
    <aside
      role="navigation"
      aria-label="Student Sidebar"
      className={`flex flex-col h-full transition-all duration-300 ease-in-out ${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      } border-r border-gray-200 dark:border-gray-700`}
    >
      {/* Header with logo + close button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <span className="text-lg font-bold">HostelHub</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close Sidebar"
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`flex items-center px-3 py-2.5 rounded-md mb-1 text-sm font-medium group transition-all duration-150 ${
                active
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
            >
              <Icon
                className={`mr-3 w-5 h-5 flex-shrink-0 ${
                  active
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 group-hover:text-blue-500"
                }`}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer with theme toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleDarkMode}
          className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white transition"
        >
          {darkMode ? (
            <>
              <FaSun className="mr-3 w-5 h-5 text-yellow-400" />
              Light Mode
            </>
          ) : (
            <>
              <FaMoon className="mr-3 w-5 h-5 text-gray-500" />
              Dark Mode
            </>
          )}
        </button>

        <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
          <p>Student Portal</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;

