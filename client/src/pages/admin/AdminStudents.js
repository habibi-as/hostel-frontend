import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/api/users?role=student");
      setStudents(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Student Management</h1>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto">
        {loading ? (
          <p>Loading...</p>
        ) : students.length === 0 ? (
          <p>No students found</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-700 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Batch</th>
                <th className="p-2">Room No</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-b dark:border-gray-700">
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.email}</td>
                  <td className="p-2">{s.batch || "-"}</td>
                  <td className="p-2">{s.room_no || "-"}</td>
                  <td className="p-2">{s.status || "active"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminStudents;
