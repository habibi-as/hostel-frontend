// src/components/student/QuickActions.js
import React from "react";
import { Link } from "react-router-dom";
import {
  FaQrcode,
  FaDollarSign,
  FaExclamationTriangle,
  FaComments,
  FaUtensils,
  FaTshirt,
} from "react-icons/fa";

const actions = [
  {
    title: "Mark Attendance",
    description: "Use QR code to mark attendance",
    icon: <FaQrcode className="w-5 h-5" aria-hidden="true" />,
    href: "/student/attendance",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Pay Fees",
    description: "View and pay hostel fees",
    icon: <FaDollarSign className="w-5 h-5" aria-hidden="true" />,
    href: "/student/fees",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Submit Complaint",
    description: "Report issues or complaints",
    icon: <FaExclamationTriangle className="w-5 h-5" aria-hidden="true" />,
    href: "/student/complaints",
    color: "from-red-500 to-red-600",
  },
  {
    title: "Chat",
    description: "Connect with hostel mates",
    icon: <FaComments className="w-5 h-5" aria-hidden="true" />,
    href: "/student/chat",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Food Menu",
    description: "View today’s menu",
    icon: <FaUtensils className="w-5 h-5" aria-hidden="true" />,
    href: "/student/food-menu",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    title: "Laundry",
    description: "Request laundry service",
    icon: <FaTshirt className="w-5 h-5" aria-hidden="true" />,
    href: "/student/laundry",
    color: "from-indigo-500 to-indigo-600",
  },
];

const QuickActions = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quick Actions</h3>
        <p className="card-description">Common student tasks</p>
      </div>

      <div className="card-content">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className={`bg-gradient-to-r ${action.color} text-white dark:text-gray-100 p-4 rounded-lg 
                hover:shadow-md transition-all duration-200 transform hover:scale-105 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${action.color.split('-')[1]}-400`}
              aria-label={action.title}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-2">{action.icon}</div>
                <h4 className="font-semibold text-sm">{action.title}</h4>
                <p className="text-xs opacity-90 mt-1">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
