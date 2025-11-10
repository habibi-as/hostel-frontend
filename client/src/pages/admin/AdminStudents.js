import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      // ✅ FIXED: removed duplicate /api
      const res = await API.get("/users?role=student");

      if (res.data?.success && Array.isArray(res.data?.data?.users)) {
        setStudents(res.data.data.users);
      } else if (Array.isArray(res.data?.data)) {
        // fallback if backend returns array directly
        setStudents(res.data.data);
      } else {
        toast.error(res.data?.message || "Unexpected response format");
      }
    } catch (err) {
      console.error("❌ Student fetch error:", err);
      toast.error(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Student Management
        </h1>

        {/* Students Table */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto">
          {loading ? (
            <p className="text-gray-500 text-center">Loading students...</p>
          ) : students.length === 0 ? (
            <p className="text-gray-500 text-center">No students found</p>
          ) : (
            <table className="w-full text-sm text-gray-800 dark:text-gray-300">
              <thead>
                <tr className="border-b dark:border-gray-700 text-left bg-gray-100 dark:bg-gray-900">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Batch</th>
                  <th className="p-2">Room No</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr
                    key={s._id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                  >
                    <td className="p-2 font-medium">{s.name || "N/A"}</td>
                    <td className="p-2">{s.email || "N/A"}</td>
                    <td className="p-2">{s.batch || "—"}</td>
                    <td className="p-2">{s.room_no || "—"}</td>
                    <td
                      className={`p-2 font-semibold ${
                        s.status === "active"
                          ? "text-green-600"
                          : s.status === "inactive"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {s.status || "active"}
                    </td>
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

export default AdminStudents;

