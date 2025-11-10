import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFees = async () => {
    try {
      const res = await API.get("/api/fees");
      setFees(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load fee records");
      console.error(err);
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Fees Management
        </h1>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto">
          {loading ? (
            <p>Loading...</p>
          ) : fees.length === 0 ? (
            <p className="text-gray-500">No fee records found</p>
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
                  <tr key={f._id} className="border-b dark:border-gray-700">
                    <td className="p-2">{f.user?.name}</td>
                    <td className="p-2">{f.user?.email}</td>
                    <td className="p-2">₹{f.amount}</td>
                    <td className="p-2">{f.feeType}</td>
                    <td className="p-2 capitalize">{f.status}</td>
                    <td className="p-2">
                      {new Date(f.dueDate).toLocaleDateString()}
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
