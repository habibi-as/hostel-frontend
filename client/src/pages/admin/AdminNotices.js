import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", message: "" });

  // ✅ Fetch all notices
  const fetchNotices = async () => {
    try {
      setLoading(true);
      // ✅ FIXED: removed duplicate /api
      const res = await API.get("/notices");

      if (res.data?.success) {
        setNotices(res.data.data || []);
      } else {
        toast.error(res.data?.message || "Failed to load notices");
      }
    } catch (err) {
      console.error("❌ Error fetching notices:", err);
      toast.error(err.response?.data?.message || "Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add a new notice
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      // ✅ FIXED: removed duplicate /api
      const res = await API.post("/notices", form);

      if (res.data?.success) {
        toast.success("✅ Notice published successfully");
        setForm({ title: "", message: "" });
        fetchNotices();
      } else {
        toast.error(res.data?.message || "Failed to publish notice");
      }
    } catch (err) {
      console.error("❌ Publish notice error:", err);
      toast.error(err.response?.data?.message || "Failed to publish notice");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Notice Management
        </h1>

        {/* ➕ Add Notice Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
        >
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input mb-3"
            required
          />
          <textarea
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="input mb-3"
            rows={3}
            required
          />
          <button
            type="submit"
            className="btn bg-blue-600 text-white hover:bg-blue-700"
          >
            Publish
          </button>
        </form>

        {/* 🗂️ Notices List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          {loading ? (
            <p className="text-gray-500 text-center">Loading notices...</p>
          ) : notices.length === 0 ? (
            <p className="text-gray-500 text-center">No notices found</p>
          ) : (
            notices.map((n) => (
              <div
                key={n._id}
                className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3 last:border-none"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {n.title || "Untitled Notice"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {n.message || "No message provided."}
                </p>
                <span className="text-xs text-gray-400">
                  📅{" "}
                  {n.createdAt
                    ? new Date(n.createdAt).toLocaleString()
                    : "Date unknown"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotices;

