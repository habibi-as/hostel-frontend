import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import AdminLayout from "../../components/admin/AdminLayout";
import StatsCard from "../../components/admin/StatsCard";
import RecentActivity from "../../components/admin/RecentActivity";
import QuickActions from "../../components/admin/QuickActions";
import ChartsSection from "../../components/admin/ChartsSection";
import LoadingSpinner from "../../components/LoadingSpinner";
import API from "../../utils/api";
import {
  FaUsers,
  FaBed,
  FaExclamationTriangle,
  FaDollarSign,
  FaChartLine,
  FaBell,
  FaComments,
} from "react-icons/fa";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch Admin Dashboard stats from backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // ✅ FIXED: Removed duplicate `/api`
      const response = await API.get("/users/stats/dashboard");

      if (response.data?.success) {
        setStats(response.data.data);
      } else {
        toast.error(response.data?.message || "Failed to fetch dashboard data");
        setError("Unable to load dashboard data");
      }
    } catch (err) {
      console.error("❌ Error fetching dashboard data:", err);
      toast.error(err.response?.data?.message || "Failed to load dashboard data");
      setError("Unable to fetch data from the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ✅ Show loader while fetching
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const statsCards = [
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      icon: <FaUsers className="w-8 h-8" />,
      color: "primary",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Rooms Occupied",
      value: `${stats?.occupiedRooms || 0}/${stats?.totalRooms || 0}`,
      icon: <FaBed className="w-8 h-8" />,
      color: "gold",
      change: "+5%",
      changeType: "positive",
    },
    {
      title: "Pending Complaints",
      value: stats?.pendingComplaints || 0,
      icon: <FaExclamationTriangle className="w-8 h-8" />,
      color: "red",
      change: "-8%",
      changeType: "negative",
    },
    {
      title: "Fees Collected",
      value: `₹${stats?.feesCollected?.toLocaleString() || 0}`,
      icon: <FaDollarSign className="w-8 h-8" />,
      color: "green",
      change: "+15%",
      changeType: "positive",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 🌟 Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-gold-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name || "Admin"}!
          </h1>
          <p className="text-primary-100">
            Here's what's happening in your hostel today.
          </p>
        </div>

        {/* 📊 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <StatsCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              change={card.change}
              changeType={card.changeType}
            />
          ))}
        </div>

        {/* 📈 Charts + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartsSection />
          </div>
          <div className="space-y-6">
            <QuickActions />
            <RecentActivity />
          </div>
        </div>

        {/* 🧠 Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly Overview */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title flex items-center">
                <FaChartLine className="mr-2 text-primary-600" />
                Monthly Overview
              </h3>
            </div>
            <div className="card-content space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  New Students
                </span>
                <span className="font-semibold text-green-600">+24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Room Occupancy
                </span>
                <span className="font-semibold text-blue-600">
                  {stats?.totalRooms
                    ? `${Math.round(
                        (stats?.occupiedRooms / stats?.totalRooms) * 100
                      )}%`
                    : "0%"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Satisfaction Rate
                </span>
                <span className="font-semibold text-gold-600">92%</span>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title flex items-center">
                <FaBell className="mr-2 text-primary-600" />
                Recent Notifications
              </h3>
            </div>
            <div className="card-content space-y-3">
              <p className="text-sm text-gray-900 dark:text-white">
                🟢 New student registered - 2m ago
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                🟡 Maintenance request pending - 15m ago
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                🔵 Fee payment received - 1h ago
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title flex items-center">
                <FaComments className="mr-2 text-primary-600" />
                Quick Stats
              </h3>
            </div>
            <div className="card-content space-y-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  System Uptime
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">4.8/5</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  User Rating
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold-600">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
