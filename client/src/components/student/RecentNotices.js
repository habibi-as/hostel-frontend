// src/components/student/RecentNotices.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBullhorn, FaClock } from "react-icons/fa";
import API from "../../utils/api";
import toast from "react-hot-toast";

const RecentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentNotices();
  }, []);

  const fetchRecentNotices = async () => {
    try {
      const res = await API.get("/student/notice");
      if (res.data?.notices?.length) {
        // Sort by date (latest first) and limit to top 3
        const sorted = res.data.notices
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);
        setNotices(sorted);
      } else {
        setNotices([]);
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
      toast.error("Failed to load recent notices");
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Notices</h3>
        </div>
        <div className="card-content">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h3 className="card-title">Recent Notices</h3>
          <Link
            to="/student/notices"
            className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View All
          </Link>
        </div>
        <p className="card-description text-gray-500 dark:text-gray-400">
          Latest announcements
        </p>
      </div>

      <div className="card-content">
        {notices.length > 0 ? (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className="flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 transition"
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    notice.priority === "urgent"
                      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200"
                      : notice.priority === "important"
                      ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                  }`}
                >
                  <FaBullhorn className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {notice.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                    <FaClock className="w-3 h-3 mr-1" />
                    {new Date(notice.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No recent notices available.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentNotices;
