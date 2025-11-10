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
      // ✅ FIX: removed redundant /api
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
      // ✅ FIX: removed redundant /api
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
            <p className="text-gray-500">Loading compla


