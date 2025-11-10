import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch fees data
  const fetchFees = async () => {
    try {
      setLoading(true);
      // ✅ FIXED: removed duplicate `/api`
      const res = await API.get("/fees");

      if (res.data?.success) {
        setFees(res.data.data || []);
      } else {
        toast.error(res.data?.message || "Failed to load fee records");
      }
    } catch (err) {
      console.error("❌ Error fetching fees:", err);
      toast.error(err.response?.data?.message || "Failed to load fee records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Fees Management
        </h1>

        {/* Fee Records Table */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto">
          {loading ? (
            <p className="text-gray-500 text-center">Loading fee records...</p>
          ) : fees.length === 0 ? (
            <p className="text-gray-500 text-center">No fee records found</p>
          ) : (
            <table className="w-full text-sm text-gray-700 dark:text-gray-300">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Due Date</th>
                  <th className="p-2">Paid Date</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f) => (
                  <tr
                    key={f._id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="p-2">{f.user?.name || "N/A"}</td>
                    <td className="p-2">{f.user?.email || "N/A"}</td>
                    <td className="p-2 font-semibold text-green-600">
                      ₹{f.amount?.toLocaleString() || 0}
                    </td>
                    <td className="p-2 capitalize">{f.feeType || "—"}</td>
                    <td
                      className={`p-2 font-semibold capitalize ${
                        f.status === "paid"
                          ? "text-green-600"
                          : f.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {f.status || "—"}
                    </td>
                    <td className="p-2">
                      {f.dueDate
                        ? new Date(f.dueDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-2">
                      {f.paidDate
                        ? new Date(f.paidDate).toLocaleDateString()
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

export default AdminFees;
