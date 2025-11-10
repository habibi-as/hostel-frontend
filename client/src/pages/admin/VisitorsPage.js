import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const VisitorsPage = () => {
  const [visitors, setVisitors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    purpose: "",
    remarks: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch visitors list
  const fetchVisitors = async () => {
    try {
      setLoading(true);
      // ✅ FIXED: removed duplicate /api
      const res = await API.get("/visitors");

      if (res.data?.success && Array.isArray(res.data?.data)) {
        setVisitors(res.data.data);
      } else {
        toast.error(res.data?.message || "Unexpected response format");
      }
    } catch (err) {
      console.error("❌ Fetch visitors error:", err);
      toast.error(err.response?.data?.message || "Failed to load visitors");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add a new visitor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // ✅ FIXED: removed duplicate /api
      const res = await API.post("/visitors", form);

      if (res.data?.success) {
        toast.success("Visitor added successfully!");
        setForm({ name: "", contact: "", purpose: "", remarks: "" });
        fetchVisitors();
      } else {
        toast.error(res.data?.message || "Failed to add visitor");
      }
    } catch (err) {
      console.error("❌ Add visitor error:", err);
      toast.error(err.response?.data?.message || "Failed to add visitor");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle checkout action
  const handleCheckout = async (id) => {
    try {
      setLoading(true);
      // ✅ FIXED: removed duplicate /api
      const res = await API.put(`/visitors/${id}/checkout`);

      if (res.data?.success) {
        toast.success("Visitor checked out successfully!");
        fetchVisitors();
      } else {
        toast.error(res.data?.message || "Failed to checkout visitor");
      }
    } catch (err) {
      console.error("❌ Checkout error:", err);
      toast.error(err.response?.data?.message || "Failed to checkout visitor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Visitor Management
        </h1>

        {/* Add Visitor Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Contact"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Purpose"
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Remarks"
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            className="input"
          />
          <button
            type="submit"
            disabled={loading}
            className={`btn bg-blue-600 text-white hover:bg-blue-700 md:col-span-4 ${
              loading && "opacity-70 cursor-not-allowed"
            }`}
          >
            {loading ? "Processing..." : "Add Visitor"}
          </button>
        </form>

        {/* Visitor Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-x-auto">
          {loading ? (
            <p className="text-gray-500 text-center">Loading visitors...</p>
          ) : visitors.length === 0 ? (
            <p className="text-gray-500 text-center">No visitors yet</p>
          ) : (
            <table className="w-full text-sm text-gray-800 dark:text-gray-300">
              <thead>
                <tr className="border-b dark:border-gray-700 text-left bg-gray-100 dark:bg-gray-900">
                  <th className="p-2">Name</th>
                  <th className="p-2">Contact</th>
                  <th className="p-2">Purpose</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Check In</th>
                  <th className="p-2">Check Out</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v) => (
                  <tr
                    key={v._id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                  >
                    <td className="p-2">{v.name}</td>
                    <td className="p-2">{v.contact}</td>
                    <td className="p-2">{v.purpose}</td>
                    <td
                      className={`p-2 font-semibold ${
                        v.status === "checked_out"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {v.status}
                    </td>
                    <td className="p-2">
                      {v.checkInTime
                        ? new Date(v.checkInTime).toLocaleString()
                        : "—"}
                    </td>
                    <td className="p-2">
                      {v.checkOutTime
                        ? new Date(v.checkOutTime).toLocaleString()
                        : "—"}
                    </td>
                    <td className="p-2 text-center">
                      {v.status !== "checked_out" && (
                        <button
                          onClick={() => handleCheckout(v._id)}
                          className="btn bg-green-600 text-white hover:bg-green-700"
                        >
                          Check Out
                        </button>
                      )}
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

export default VisitorsPage;
