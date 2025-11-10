import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/api/complaints");
      setComplaints(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load complaints");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/api/complaints/${id}`, { status });
      toast.success("Status updated");
      fetchComplaints();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Complaint Management</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        {complaints.length === 0 ? (
          <p className="text-gray-500">No complaints found</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-700 text-left">
                <th className="p-2">Student</th>
                <th className="p-2">Category</th>
                <th className="p-2">Description</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id} className="border-b dark:border-gray-700">
                  <td className="p-2">{c.student?.name}</td>
                  <td className="p-2">{c.category}</td>
                  <td className="p-2">{c.description}</td>
                  <td className="p-2 capitalize">{c.status}</td>
                  <td className="p-2">
                    <select
                      onChange={(e) => updateStatus(c._id, e.target.value)}
                      value={c.status}
                      className="input"
                    >
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminComplaints;

