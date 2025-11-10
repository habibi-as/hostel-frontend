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

  const fetchVisitors = async () => {
    try {
      const res = await API.get("/api/visitors");
      setVisitors(res.data.data || []);
    } catch {
      toast.error("Failed to load visitors");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/visitors", form);
      toast.success("Visitor added");
      setForm({ name: "", contact: "", purpose: "", remarks: "" });
      fetchVisitors();
    } catch {
      toast.error("Failed to add visitor");
    }
  };

  const handleCheckout = async (id) => {
    try {
      await API.put(`/api/visitors/${id}/checkout`);
      toast.success("Visitor checked out");
      fetchVisitors();
    } catch {
      toast.error("Failed to checkout visitor");
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Visitor Management</h1>

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
            className="btn bg-blue-600 text-white hover:bg-blue-700 md:col-span-4"
          >
            Add Visitor
          </button>
        </form>

        {/* Visitor List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-x-auto">
          {visitors.length === 0 ? (
            <p className="text-gray-500">No visitors yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700 text-left">
                  <th className="p-2">Name</th>
                  <th className="p-2">Contact</th>
                  <th className="p-2">Purpose</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Check In</th>
                  <th className="p-2">Check Out</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v) => (
                  <tr key={v._id} className="border-b dark:border-gray-700">
                    <td className="p-2">{v.name}</td>
                    <td className="p-2">{v.contact}</td>
                    <td className="p-2">{v.purpose}</td>
                    <td className="p-2 capitalize">{v.status}</td>
                    <td className="p-2">
                      {new Date(v.checkInTime).toLocaleString()}
                    </td>
                    <td className="p-2">
                      {v.checkOutTime
                        ? new Date(v.checkOutTime).toLocaleString()
                        : "—"}
                    </td>
                    <td className="p-2">
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
