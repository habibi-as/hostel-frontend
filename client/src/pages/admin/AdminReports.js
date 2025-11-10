import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminReports = () => {
  const [type, setType] = useState("attendance");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch selected report type
  const fetchReport = async () => {
    try {
      setLoading(true);
      // ✅ FIXED: Removed duplicate /api
      const res = await API.get(`/reports/${type}`);

      if (res.data?.success && res.data?.data) {
        setData(res.data.data);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report loaded`);
      } else {
        toast.error(res.data?.message || "Failed to load report");
      }
    } catch (err) {
      console.error("❌ Report fetch error:", err);
      toast.error(err.response?.data?.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reports Center
        </h1>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <select
            className="input w-full md:w-auto"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="attendance">Attendance Report</option>
            <option value="payments">Payment Report</option>
            <option value="complaints">Complaint Report</option>
          </select>

          <button
            onClick={fetchReport}
            disabled={loading}
            className={`btn bg-blue-600 text-white hover:bg-blue-700 ${
              loading && "opacity-70 cursor-not-allowed"
            }`}
          >
            {loading ? "Loading..." : "Generate Report"}
          </button>
        </div>

        {/* Report Display */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto">
          {loading ? (
            <p className="text-gray-500 text-center">Fetching report...</p>
          ) : data.length === 0 ? (
            <p className="text-gray-500 text-center">No data available for this report</p>
          ) : (
            <pre className="text-xs text-gray-300 bg-gray-900 p-3 rounded overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;

