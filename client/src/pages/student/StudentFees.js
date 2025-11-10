import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import StudentLayout from "../../components/student/StudentLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { FaRupeeSign, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const StudentFees = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      // ✅ FIXED: Use student endpoint (prevents /api/api duplication)
      const res = await API.get("/student/fees");

      if (res.data?.success) {
        setFees(res.data.data || []);
      } else {
        toast.error(res.data?.message || "Failed to load fees");
      }
    } catch (err) {
      console.error("❌ Fetch fees error:", err);
      toast.error("Unable to fetch your fee records");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FaRupeeSign className="mr-2 text-green-600" />
            My Fees & Payments
          </h1>
        </div>

        {/* Fees Table */}
        <div className="card p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
          {loading ? (
            <div className="flex justify-center py-10">
              <LoadingSpinner size="lg" />
            </div>
          ) : fees.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No fee records found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fee Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Paid Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {fees.map((f) => (
                    <tr key={f._id}>
                      <td className="px-4 py-3 capitalize text-gray-800 dark:text-gray-100">
                        {f.feeType || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        ₹{f.amount || 0}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {f.dueDate
                          ? new Date(f.dueDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            f.status === "paid"
                              ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                              : f.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300"
                              : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
                          }`}
                        >
                          {f.status === "paid" ? (
                            <FaCheckCircle className="mr-1" />
                          ) : (
                            <FaTimesCircle className="mr-1" />
                          )}
                          {f.status || "unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                        {f.paidDate
                          ? new Date(f.paidDate).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentFees;

