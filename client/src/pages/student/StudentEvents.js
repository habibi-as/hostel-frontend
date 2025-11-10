import React, { useEffect, useState } from "react";
import StudentLayout from "../../components/student/StudentLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ Fetch student events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      // ✅ Fixed: removed raw axios & duplicate `/api`
      const res = await API.get("/student/events");

      if (res.data?.success) {
        setEvents(res.data.events || []);
      } else {
        toast.error(res.data?.message || "Failed to fetch events");
      }
    } catch (err) {
      console.error("❌ Events fetch error:", err);
      toast.error("Error loading events");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">
          Upcoming Events
        </h1>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            No upcoming events at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="card bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-primary-600 mb-2">
                  {event.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {event.description || "No description available."}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <FaCalendarAlt />
                    <span>
                      {new Date(event.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt />
                    <span>{event.location || "TBA"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default Events;
