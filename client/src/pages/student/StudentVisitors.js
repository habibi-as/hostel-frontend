import React, { useState, useEffect } from "react";
import StudentLayout from "../../components/student/StudentLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import API from "../../utils/api";
import { FaUserFriends } from "react-icons/fa";

const StudentVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    visitorName: "",
    purpose: "",
    visitDate: "",
  });

  // ✅ Fetch visitors
  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const res = await API.get("/student/visitors");
      if (res.data?.success) {
        setVisitors(res.data.visitors || []);
      } else {
        toast.error(res.data?.message || "Failed to load visitors");
      }
    } catch (err) {
      console.error("❌ Fetch visitors error:", err);
      toast.error("Unable to fetch visitors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit visitor request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.visitorName || !formData.purpose || !formData.visitDate) {
      toast.error("Please fill all fields");
      return;
    }

    setAdding(true);
    try {
      const res = await API.post("/student/visitors", formData);
      if (res.data?.success) {
        toast.success(res.data.message || "Visitor request submitted");
        setFormData({ visitorName: "", purpose: "", visitDate: "" });
        fetchVisitors();
      } else {
        toast.error(res.data?.message || "Failed to submit request");
      }
    } catch (err) {
      console.error("❌ Submit visitor error:", err);
      toast.error("Unable to submit visitor request");
    } finally {
      setAdding(false);
    }
  };

  // 🌀 Loading State
  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FaUserFriends className="mr-3 text-primary-600" />
            Visitor Management
          </h1>
        </div>

        {/* Add Visitor Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Request Visitor Entry
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="visitorName"
              value={formData.visitorName}
              onChange={handleChange}
              placeholder="Visitor Name"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Purpose of Visit"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={adding}
              className={`w-full py-2 font-semibold rounded-lg text-white ${
                adding ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {adding ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>

        {/* Visitor List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Visitor Records
          </h2>

          {visitors.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No visitor records found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-primary-600 text-white">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Purpose</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((v) => (
                    <tr
                      key={v._id}
                      className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                    >
                      <td className="p-3 text-gray-900 dark:text-gray-100">
                        {v.visitorName}
                      </td>
                      <td className="p-3 text-gray-900 dark:text-gray-100">
                        {v.purpose}
                      </td>
                      <td className="p-3 text-gray-900 dark:text-gray-100">
                        {new Date(v.visitDate).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            v.status === "Approved"
                              ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                              : v.status === "Rejected"
                              ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300"
                          }`}
                        >
                          {v.status || "Pending"}
                        </span>
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

export default StudentVisitors;
