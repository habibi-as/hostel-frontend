import React, { useEffect, useState } from "react";
import StudentLayout from "../../components/student/StudentLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { FaBell } from "react-icons/fa";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch notices from backend
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await API.get("/student/notice");
      if (res.data?.success) {
        setNotices(res.data.notices || []);
      } else {
        toast.error(res.data?.message || "Failed to load notices");
      }
    } catch (err) {
      console.error("❌ Notice fetch error:", err);
      toast.error("Unable to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // 🌀 Loading State
  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FaBell className="mr-3 text-primary-600" />
            Hostel Notice Board
          </h1>
        </div>

        {/* Notices */}
        {notices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notices
              .slice()
              .reverse() // Show latest first
              .map((notice) => (
                <div
                  key={notice._id}
                  className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow hover:shadow-lg transition border-l-4 border-primary-600 dark:border-primary-500"
                >
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {notice.title}
                  </h2>

                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    {notice.description}
                  </p>

                  {notice.link && (
                    <a
                      href={notice.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 dark:text-blue-400 underline text-sm"
                    >
                      View Details
                    </a>
                  )}

                  <div className="flex justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      📅{" "}
                      {notice.date
                        ? new Date(notice.date).toLocaleDateString()
                        : "—"}
                    </span>
                    <span>👤 {notice.postedBy || "Admin"}</span>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No notices available.
          </p>
        )}
      </div>
    </StudentLayout>
  );
};

export default Notice;

