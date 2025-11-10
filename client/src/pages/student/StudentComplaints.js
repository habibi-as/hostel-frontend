import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../utils/api";
import toast from "react-hot-toast";

const ComplaintForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      // ✅ FIXED: no double `/api`, token auto-attached by API instance
      const res = await API.post("/student/complaint", formData);

      if (res.data?.success) {
        toast.success(res.data.message || "Complaint submitted successfully!");
        setFormData({ subject: "", description: "" });
      } else {
        toast.error(res.data?.message || "Failed to submit complaint");
      }
    } catch (err) {
      console.error("❌ Complaint submission error:", err);
      toast.error(err.response?.data?.message || "Error submitting complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
          Submit a Complaint
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Field */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              placeholder="Enter complaint subject"
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              placeholder="Describe your issue clearly"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 font-semibold rounded-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
