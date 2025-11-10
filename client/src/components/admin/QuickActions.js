// src/components/admin/QuickActions.js
import React from "react";
import { Link } from "react-router-dom";
import {
  FaUserPlus,
  FaBed,
  FaDollarSign,
  FaBullhorn,
  FaExclamationTriangle,
  FaQrcode,
} from "react-icons/fa";

const QuickActions = () => {
  const actions = [
    {
      title: "Add Student",
      description: "Register a new student",
      icon: <FaUserPlus className="w-6 h-6" />,
      href: "/admin/students",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Manage Rooms",
      description: "View and assign rooms",
      icon: <FaBed className="w-6 h-6" />,
      href: "/admin/rooms",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Fee Collection",
      description: "Process fee payments",
      icon: <FaDollarSign className="w-6 h-6" />,
      href: "/admin/fees",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Send Notice",
      description: "Create announcements",
      icon: <FaBullhorn className="w-6 h-6" />,
      href: "/admin/notices",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "View Complaints",
      description: "Handle student complaints",
      icon: <FaExclamationTriangle className="w-6 h-6" />,
      href: "/admin/complaints",
      color: "from-red-500 to-red-600",
    },
    {
      title: "QR Attendance",
      description: "Generate QR codes",
      icon: <FaQrcode className="w-6 h-6" />,
      href: "/admin/attendance",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <div className="card transition-colors duration-300">
      <div className="card-header">
        <h3 className="card-title">Quick Actions</h3>
        <p className="card-description text-sm">
          Common administrative tasks
        </p>
      </div>

      <div className="card-content">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className={`bg-gradient-to-r ${action.color} text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${action.color.split("-")[1]}-500`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 opacity-90">{action.icon}</div>
                <h4 className="font-semibold text-sm tracking-wide">
                  {action.title}
                </h4>
                <p className="text-xs opacity-90 mt-1">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
