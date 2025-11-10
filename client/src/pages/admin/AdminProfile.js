import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Admin Profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      // ✅ FIXED: removed duplicate `/api`
      const res = await API.get("/auth/verify");

      if (res.data?.success && res.data?.user) {
        setAdmin(res.data.user);
      } else {
        toast.error(res.data?.message || "Failed to load admin profile");
      }
    } catch (err) {
      console.error("❌ Profile fetch error:", err);
      toast.error(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Profile
        </h1>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          {loading ? (
            <p className="text-gray-500 text-center">Loading profile...</p>
          ) : admin ? (
            <div className="space-y-4 text-gray-800 dark:text-gray-200">
              <p>
                <strong>Name:</strong>{" "}
                {admin.name ? admin.name : "Not available"}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {admin.email ? admin.email : "Not available"}
              </p>
              <p>
                <strong>Role:</strong>{" "}
                <span className="capitalize">
                  {admin.role ? admin.role : "N/A"}
                </span>
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {admin.createdAt
                  ? new Date(admin.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No profile data found</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;

