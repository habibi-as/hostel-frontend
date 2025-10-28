import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import {
  FaWifi,
  FaUtensils,
  FaShieldAlt,
  FaDumbbell,
  FaCar,
  FaBook,
  FaStar,
  FaArrowRight,
  FaSun,
  FaMoon,
} from "react-icons/fa";

const LandingPage = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  const facilities = [
    {
      icon: <FaWifi className="w-8 h-8 text-primary-600" />,
      title: "High-Speed WiFi",
      description: "Free high-speed internet access throughout the hostel.",
    },
    {
      icon: <FaUtensils className="w-8 h-8 text-primary-600" />,
      title: "Quality Meals",
      description: "Nutritious and delicious meals served three times daily.",
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-primary-600" />,
      title: "24/7 Security",
      description: "Round-the-clock security with CCTV surveillance.",
    },
    {
      icon: <FaDumbbell className="w-8 h-8 text-primary-600" />,
      title: "Fitness Center",
      description: "Well-equipped gym for your fitness needs.",
    },
    {
      icon: <FaCar className="w-8 h-8 text-primary-600" />,
      title: "Parking",
      description: "Secure parking space for vehicles.",
    },
    {
      icon: <FaBook className="w-8 h-8 text-primary-600" />,
      title: "Study Rooms",
      description: "Quiet study areas and library access.",
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <header className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold gradient-text">HostelHub</h1>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
              </button>

              {/* Nav Links */}
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-gold-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Experience Smart Living with <span className="gradient-text">HostelHub</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Manage your hostel life effortlessly — from registration to room management,
            all at your fingertips.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn btn-primary btn-lg inline-flex items-center"
            >
              Get Started <FaArrowRight className="ml-2" />
            </Link>
            <Link
              to="/about"
              className="btn btn-outline btn-lg inline-flex items-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Premium Facilities
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Everything you need to make your stay comfortable and productive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <div
                key={index}
                className="card hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <div className="flex justify-center mb-4">{facility.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {facility.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {facility.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${darkMode ? "bg-gray-800" : "bg-gray-900"} text-white`}>
        <div className="max-w-7xl mx-auto px-4 py-10 text-center">
          <p className="text-gray-400 mb-2">
            © {new Date().getFullYear()} HostelHub. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Designed for modern students | Powered by React + Tailwind
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
