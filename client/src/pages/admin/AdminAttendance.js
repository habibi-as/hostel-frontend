import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    date: "",
    batch: "",
    status: "",
  });

  // ✅ Fetch attendance from backend
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams(filters).toString();
      const res = await API.get(`/api/attendance?${query}`);
      setAttendance(res.data.data || []);
    } catch (error) {
      console.error("Fetch attendance error:", error);
      toast.error("Failed to fetch attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // ✅ Handle filter change
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchAttendance();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Attendance Management
          </h1>
        </div>

        {/* Filters */}
        <form
          onSubmit={handleFilterSubmit}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="input"
          />
          <input
            type="text"
            name="batch"
            placeholder="Batch"
            value={filters.batch}
            onChange={handleFilterChange}
            className="input"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="input"
          >
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>
          <button
            type="submit"
            className="btn bg-blue-600 hover:bg-blue-700 text-white"
          >
            Apply Filter
          </button>
        </form>

        {/* Attendance Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-x-auto">
          {loading ? (
            <p className="text-gray-500">Loading attendance...</p>
          ) : attendance.length === 0 ? (
            <p className="text-gray-500">No records found</p>
          ) : (
            <table className="w-full text-sm text-gray-700 dark:text-gray-300">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="p-2">Date</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Batch</th>
                  <th className="p-2">Room No</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Check In</th>
                  <th className="p-2">Check Out</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((a) => (
                  <tr
                    key={a._id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="p-2">
                      {new Date(a.date).toLocaleDateString()}
                    </td>
                    <td className="p-2">{a.user?.name || "N/A"}</td>
                    <td className="p-2">{a.user?.batch || "N/A"}</td>
                    <td className="p-2">{a.user?.room_no || "N/A"}</td>
                    <td className="p-2 capitalize">{a.status}</td>
                    <td className="p-2">{a.checkIn || "—"}</td>
                    <td className="p-2">{a.checkOut || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAttendance;
