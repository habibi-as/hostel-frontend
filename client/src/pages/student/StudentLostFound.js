import React, { useEffect, useState } from "react";
import StudentLayout from "../../components/student/StudentLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { FaBoxOpen } from "react-icons/fa";

const LostFound = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    type: "Lost",
    location: "",
  });
  const [adding, setAdding] = useState(false);

  // ✅ Fetch all lost & found reports
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await API.get("/student/lostfound");

      if (res.data?.success) {
        setItems(res.data.items || []);
      } else {
        toast.error(res.data?.message || "Failed to load lost & found data");
      }
    } catch (err) {
      console.error("❌ Lost & Found fetch error:", err);
      toast.error("Unable to fetch lost & found data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ✅ Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit new lost/found report
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.itemName || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    setAdding(true);
    try {
      const res = await API.post("/student/lostfound", formData);

      if (res.data?.success) {
        toast.success(res.data.message || "Report added successfully!");
        setFormData({ itemName: "", description: "", type: "Lost", location: "" });
        fetchItems();
      } else {
        toast.error(res.data?.message || "Failed to submit report");
      }
    } catch (err) {
      console.error("❌ Lost & Found submit error:", err);
      toast.error("Unable to submit lost & found report");
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
            <FaBoxOpen className="mr-3 text-primary-600" />
            Lost & Found
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-10"
        >
          <h2 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">
            Report Lost / Found Item
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="Item Name"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Description"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Last seen / Found location (optional)"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={adding}
              className={`w-full py-2 font-semibold rounded-lg text-white ${
                adding ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {adding ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>

        {/* Lost & Found Items List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length ? (
            items.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.type === "Lost"
                        ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
                        : "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                    }`}
                  >
                    {item.type}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.dateReported).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                  {item.itemName}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  {item.description}
                </p>

                {item.location && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    📍 {item.location}
                  </p>
                )}

                <p
                  className={`text-xs mt-3 font-medium ${
                    item.status === "Returned"
                      ? "text-green-600 dark:text-green-400"
                      : "text-yellow-600 dark:text-yellow-400"
                  }`}
                >
                  Status: {item.status || "Pending"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
              No lost or found reports yet.
            </p>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default LostFound;


