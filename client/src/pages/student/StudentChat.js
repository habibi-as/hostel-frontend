import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import StudentLayout from "../../components/student/StudentLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import API from "../../utils/api";
import toast from "react-hot-toast";
import {
  FaExclamationTriangle,
  FaPaperPlane,
  FaPlusCircle,
} from "react-icons/fa";

const StudentComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    category: "",
    description: "",
    image: null,
  });

  const categories = [
    "Cleaning",
    "Food",
    "Maintenance",
    "Security",
    "Internet",
    "Other",
  ];

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ✅ Fetch student complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      // ✅ FIXED: removed duplicate /api
      const res = await API.get("/complaints");

      if (res.data?.success) {
        setComplaints(res.data.data || []);
      } else {
        toast.error(res.data?.message || "Failed to load complaints");
      }
    } catch (err) {
      console.error("❌ Fetch complaints error:", err);
      toast.error("Error fetching complaints");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle form change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  // ✅ Submit new complaint
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category || !form.description.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("category", form.category);
      formData.append("description", form.description);
      if (form.image) formData.append("image", form.image);

      // ✅ FIXED: removed duplicate /api
      const res = await API.post("/complaints", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        toast.success("Complaint submitted successfully!");
        setForm({ category: "", description: "", image: null });
        setShowForm(false);
        fetchComplaints();
      } else {
        toast.error(res.data?.message || "Failed to submit complaint");
      }
    } catch (err) {
      console.error("❌ Submit complaint error:", err);
      toast.error("Error submitting complaint");
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FaExclamationTriangle className="mr-2 text-red-600" />
            My Complaints
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <FaPlusCircle />
            <span>{showForm ? "Cancel" : "New Complaint"}</span>
          </button>
        </div>

        {/* Complaint Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="card p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Image (optional)
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 dark:bg-gray-800 dark:text-white"
                placeholder="Describe your issue clearly..."
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-success flex items-center space-x-2"
              >
                <FaPaperPlane />
                <span>Submit Complaint</span>
              </button>
            </div>
          </form>
        )}

        {/* Complaints Table */}
        <div className="card p-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <LoadingSpinner />
            </div>
          ) : complaints.length === 0 ? (
            <p className="text-center text-gray-500">
              No complaints submitted yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {complaints.map((c) => (
                    <tr
                      key={c._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="px-4 py-3 capitalize text-gray-800 dark:text-gray-100">
                        {c.category}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {c.description}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            c.status === "resolved"
                              ? "bg-green-100 text-green-700"
                              : c.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {new Date(c.createdAt).toLocaleDateString()}
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

export default StudentComplaints;
