import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: "", message: "" });

  const fetchNotices = async () => {
    try {
      const res = await API.get("/api/notices");
      setNotices(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load notices");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/notices", form);
      toast.success("Notice published");
      setForm({ title: "", message: "" });
      fetchNotices();
    } catch (err) {
      toast.error("Failed to publish notice");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Notice Management</h1>

        {/* Add Notice */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
        >
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input mb-2"
            required
          />
          <textarea
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="input mb-2"
            rows={3}
          />
          <button className="btn bg-blue-600 text-white hover:bg-blue-700">
            Publish
          </button>
        </form>

        {/* Notices List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          {notices.length === 0 ? (
            <p className="text-gray-500">No notices found</p>
          ) : (
            notices.map((n) => (
              <div
                key={n._id}
                className="border-b border-gray-300 dark:border-gray-700 pb-3 mb-3"
              >
                <h3 className="text-lg font-semibold">{n.title}</h3>
                <p className="text-gray-500">{n.message}</p>
                <span className="text-sm text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
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
