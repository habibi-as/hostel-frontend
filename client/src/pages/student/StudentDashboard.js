import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import StudentLayout from "../../components/student/StudentLayout";
import StatsCard from "../../components/student/StatsCard";
import RecentNotices from "../../components/student/RecentNotices";
import QuickActions from "../../components/student/QuickActions";
import AttendanceChart from "../../components/student/AttendanceChart";
import LoadingSpinner from "../../components/LoadingSpinner";
import API from "../../utils/api";
import toast from "react-hot-toast";
import {
  FaDollarSign,
  FaChartLine,
  FaQrcode,
  FaComments,
  FaUtensils,
  FaBell,
} from "react-icons/fa";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ✅ Fetch Student Dashboard Stats
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // ✅ Fixed: Removed duplicate `/api`
      const res = await API.get("/student/dashboard/stats");

      if (res.data?.success) {
        setStats(res.data.data);
      } else {
        throw new Error(res.data?.message || "Failed to load stats");
      }
    } catch (err) {
      console.error("❌ Error fetching dashboard data:", err);
      setError("Failed to load your dashboard data");
      toast.error("Unable to fetch your dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchDashboardData} className="btn btn-primary">
            Retry
          </button>
        </div>
      </StudentLayout>
    );
  }

  const statsCards = [
    {
      title: "Attendance",
      value: `${stats?.attendancePercentage || 0}%`,
      icon: <FaChartLine className="w-6 h-6" />,
      color: "primary",
      description: "This month",
    },
    {
      title: "Pending Fees",
      value: stats?.pendingFees || 0,
      icon: <FaDollarSign className="w-6 h-6" />,
      color: "red",
      description: "Unpaid fees",
    },
    {
      title: "Complaints",
      value: `${stats?.complaintsPending || 0}/${stats?.complaintsTotal || 0}`,
      icon: <FaComments className="w-6 h-6" />,
      color: "gold",
      description: "Pending / Total",
    },
    {
      title: "Upcoming Events",
      value: stats?.upcomingEvents?.length || 0,
      icon: <FaBell className="w-6 h-6" />,
      color: "blue",
      description: "Next 7 days",
    },
  ];

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-gold-600 rounded-lg p-6 text-white shadow">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user?.name || "Student"}!
          </h1>
          <p className="text-primary-100">Here’s your live hostel overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, i) => (
            <StatsCard
              key={i}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              description={card.description}
            />
          ))}
        </div>

        {/* Main Grid: Attendance Chart + Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AttendanceChart
              attendancePercentage={stats?.attendancePercentage || 0}
            />
          </div>
          <div className="space-y-6">
            <QuickActions />
            <RecentNotices />
          </div>
        </div>

        {/* Extra Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Menu */}
          <div className="card dark:bg-gray-800">
            <div className="card-header">
              <h3 className="card-title flex items-center">
                <FaUtensils className="mr-2 text-primary-600" />
                Today's Menu
              </h3>
            </div>
            <div className="card-content space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Breakfast
                </h4>
                <p className="text-sm text-gray-500">Idli, Sambar, Coffee</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Lunch
                </h4>
                <p className="text-sm text-gray-500">
                  Rice, Dal, Curd, Vegetables
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Dinner
                </h4>
                <p className="text-sm text-gray-500">Roti, Curry, Salad</p>
              </div>
            </div>
          </div>

          {/* Quick Chat */}
          <div className="card dark:bg-gray-800">
            <div className="card-header">
              <h3 className="card-title flex items-center">
                <FaComments className="mr-2 text-primary-600" />
                Quick Chat
              </h3>
            </div>
            <div className="card-content">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Connect with your hostel mates instantly.
              </p>
              <button className="btn btn-primary w-full">Open Chat</button>
            </div>
          </div>

          {/* QR Attendance */}
          <div className="card dark:bg-gray-800">
            <div className="card-header">
              <h3 className="card-title flex items-center">
                <FaQrcode className="mr-2 text-primary-600" />
                QR Attendance
              </h3>
            </div>
            <div className="card-content">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Mark your attendance using QR code.
              </p>
              <button className="btn btn-outline w-full">Generate QR</button>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
