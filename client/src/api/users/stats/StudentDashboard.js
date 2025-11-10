// client/src/pages/StudentDashboard.js
import React, { useEffect, useState } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await API.get("/users/stats");
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response) {
        console.error("API Response Data:", error.response.data);
        console.error("API Response Status:", error.response.status);
      } else if (error.request) {
        console.error("No response from server:", error.request);
      } else {
        console.error("Request setup error:", error.message);
      }
      toast.error("Unable to fetch your dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading dashboard...</p>;
  if (!stats) return <p className="p-6 text-center text-red-600">No data available</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Student Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="font-medium text-gray-700">Complaints Filed</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.complaints}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="font-medium text-gray-700">Fees Paid</h3>
          <p className="text-3xl font-bold text-green-600">{stats.paidFees}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="font-medium text-gray-700">Pending Fees</h3>
          <p className="text-3xl font-bold text-red-600">{stats.pendingFees}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
