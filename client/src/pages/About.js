import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
        About Our Hostel Management System 🏠
      </h1>
      <p className="max-w-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
        Our Hostel Management System is built to make hostel operations easier,
        faster, and more organized. It allows admins to manage rooms, fees,
        attendance, and complaints — all in one central dashboard. Students can
        easily access their details, submit issues, and stay updated on events.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/register"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
