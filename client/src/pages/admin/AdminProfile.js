import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/api/auth/verify");
      setAdmin(res.data.user);
    } catch (err) {
      toast.error("Failed to fetch profile");
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Profile
        </h1>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          {loading ? (
            <p>Loading...</p>
          ) : admin ? (
            <div className="space-y-3">
              <p>
                <strong>Name:</strong> {admin.name}
              </p>
              <p>
                <strong>Email:</strong> {admin.email}
              </p>
              <p>
                <strong>Role:</strong>{" "}
                <span className="capitalize">{admin.role}</span>
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(admin.createdAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No profile data found</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
