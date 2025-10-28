import React from "react";
import { Link } from "react-router-dom";
import { FaMoon, FaSun, FaArrowRight } from "react-icons/fa";

export default function LandingPage() {
  const [darkMode, setDarkMode] = React.useState(
    localStorage.getItem("theme") === "dark"
  );

  // Apply theme on load & change
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Navbar */}
      <header className="w-full py-4 px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          🏠 Hostel Management System
        </h1>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden sm:inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all"
          >
            Login
          </Link>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <FaSun className="text-yellow-400 w-5 h-5" />
            ) : (
              <FaMoon className="text-gray-600 w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Simplify Hostel Life with{" "}
          <span className="text-blue-600 dark:text-blue-400">
            Asurax Studio
          </span>
        </h2>
        <p className="max-w-2xl text-gray-600 dark:text-gray-300 mb-8 text-lg">
          A modern platform for managing hostel operations — rooms, fees,
          complaints, attendance, and more — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            Get Started <FaArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/about"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            Learn More
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        © {new Date().getFullYear()} Made with ❤️ by{" "}
        <span className="text-blue-500 font-medium">Asurax Studio</span>
      </footer>
    </div>
  );
}

