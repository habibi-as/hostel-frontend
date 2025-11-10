import React, { useEffect, useState } from "react";
import StudentLayout from "../../components/student/StudentLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { FaTools } from "react-icons/fa";

const Maintenance = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    roomNumber: "",
  });

  // ✅ Fetch maintenance requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/student/maintenance");
      if (res.data?.success) {
        setRequests(res.data.requests || []);
      } else {
        toast.error(res.data?.message || "Failed to load maintenance data");
      }
    } catch (err) {
      console.error("❌ Maintenance fetch error:", err);
      toast.error("Unable to fetch maintenance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ✅ Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit new maintenance request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.description || !formData.roomNumber) {
      toast.error("Please fill all fields");
      return;
    }

    setAdding(true);
    try {
      const res = await API.post("/student/maintenance", formData);
      if (res.data?.success) {
        toast.success(res.data.message || "Request submitted successfully!");
        setFormData({ category: "", description: "", roomNumber: "" });
        fetchRequests();
      } else {
        toast.error(res.data?.message || "Failed to submit request");
      }
    } catch (err) {
      console.error("❌ Maintenance submit error:", err);
      toast.error("Unable to submit maintenance request");
    } finally {
      setAdding(false);
    }
  };

  // 🌀 Loading
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
            <FaTools className="mr-3 text-primary-600" />
            Maintenance Requests
          </h1>
        </div>

        {/* Add Maintenance Form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-10"
        >
          <h2 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">
            Report Maintenance Issue
          </h2>

          <div className="space-y-4">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Furniture">Furniture</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              placeholder="Enter Room Number"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe the issue..."
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
          </div>
        </form>

        {/* Maintenance Requests List */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
          {requests.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-6">
              No maintenance requests yet.
            </p>
          ) : (
            <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-primary-600 text-white">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Room</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req._id}
                    className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                  >
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      {new Date(req.dateReported).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      {req.category}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      {req.roomNumber}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          req.status === "Resolved"
                            ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                            : req.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300"
                            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {req.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default Maintenance;
