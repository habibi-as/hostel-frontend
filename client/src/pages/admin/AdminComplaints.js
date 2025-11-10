import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get("/complaints");

      if (res.data?.success) {
        setComplaints(res.data.data || []);
      } else {
        toast.error(res.data?.message || "Failed to load complaints");
      }
    } catch (err) {
      console.error("❌ Complaint fetch error:", err);
      toast.error(err.response?.data?.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update complaint status
  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/complaints/${id}`, { status });

      if (res.data?.success) {
        toast.success("✅ Complaint status updated");
        fetchComplaints();
      } else {
        toast.error(res.data?.message || "Failed to update status");
      }
    } catch (err) {
      console.error("❌ Update status error:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Complaint Management
        </h1>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto">
          {loading ? (
            <p className="text-gray-500">Loading complaints...</p>
          ) : complaints.length > 0 ? (
            <table className="min-w-full border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Complaint</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr
                    key={complaint._id}
                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-3">{complaint.studentName || "N/A"}</td>
                    <td className="p-3">{complaint.description}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          complaint.status === "Resolved"
                            ? "bg-green-100 text-green-700"
                            : complaint.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(complaint.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => updateStatus(complaint._id, "In Progress")}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => updateStatus(complaint._id, "Resolved")}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Resolved
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-6">
              No complaints available.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminComplaints;
