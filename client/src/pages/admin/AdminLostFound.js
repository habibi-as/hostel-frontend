import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminLostFound = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    itemName: "",
    description: "",
    status: "lost",
    location: "",
  });

  // ✅ Fetch all lost & found records
  const fetchItems = async () => {
    try {
      setLoading(true);
      // ✅ FIXED: removed duplicate `/api`
      const res = await API.get("/lost-found");

      if (res.data?.success) {
        setItems(res.data.data || []);
      } else {
        toast.error(res.data?.message || "Failed to fetch lost & found data");
      }
    } catch (err) {
      console.error("❌ Fetch lost-found error:", err);
      toast.error(err.response?.data?.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle new item submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ FIXED: removed duplicate `/api`
      const res = await API.post("/lost-found", form);

      if (res.data?.success) {
        toast.success("✅ Item added successfully!");
        setForm({ itemName: "", description: "", status: "lost", location: "" });
        fetchItems();
      } else {
        toast.error(res.data?.message || "Failed to add item");
      }
    } catch (err) {
      console.error("❌ Add item error:", err);
      toast.error(err.response?.data?.message || "Failed to add item");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Lost & Found Management
        </h1>

        {/* Add New Item Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Item Name"
              value={form.itemName}
              onChange={(e) => setForm({ ...form, itemName: e.target.value })}
              className="input"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="input"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="input"
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
            <button
              type="submit"
              className="btn bg-blue-600 text-white hover:bg-blue-700"
            >
              Add Item
            </button>
          </div>

          <textarea
            rows="2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-2 input"
          ></textarea>
        </form>

        {/* Display Items Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-x-auto">
          {loading ? (
            <p className="text-gray-500 text-center">Loading records...</p>
          ) : items.length === 0 ? (
            <p className="text-gray-500 text-center">No records found</p>
          ) : (
            <table className="w-full text-sm text-gray-700 dark:text-gray-300">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="p-2">Item</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="p-2">{item.itemName || "—"}</td>
                    <td
                      className={`p-2 capitalize font-semibold ${
                        item.status === "found"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {item.status || "—"}
                    </td>
                    <td className="p-2">{item.location || "—"}</td>
                    <td className="p-2">{item.description || "—"}</td>
                    <td className="p-2">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "—"}
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

export default AdminLostFound;

