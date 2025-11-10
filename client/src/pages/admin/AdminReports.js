import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminReports = () => {
  const [type, setType] = useState("attendance");
  const [data, setData] = useState([]);

  const fetchReport = async () => {
    try {
      const res = await API.get(`/api/reports/${type}`);
      setData(res.data.data || []);
      toast.success("Report loaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch report");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Reports Center</h1>

        <div className="flex gap-4">
          <select
            className="input"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="attendance">Attendance Report</option>
            <option value="payments">Payment Report</option>
            <option value="complaints">Complaint Report</option>
          </select>

          <button
            onClick={fetchReport}
            className="btn bg-blue-600 text-white hover:bg-blue-700"
          >
            Generate Report
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto">
          {data.length === 0 ? (
            <p className="text-gray-500">No data yet</p>
          ) : (
            <pre className="text-xs text-gray-300 bg-gray-900 p-2 rounded">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
