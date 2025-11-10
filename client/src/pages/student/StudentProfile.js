import React, { useEffect, useState } from "react";
import StudentLayout from "../../components/student/StudentLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import API from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState("");

  // ✅ Fetch student profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/student/profile");
      if (res.data?.success) {
        setProfile(res.data.student);
        setPhone(res.data.student.phone || "");
        setProfilePic(res.data.student.profilePic || "");
      } else {
        toast.error(res.data?.message || "Failed to load profile");
      }
    } catch (err) {
      console.error("❌ Profile fetch error:", err);
      toast.error("Unable to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Update profile info
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await API.put("/student/profile", { phone, profilePic });
      if (res.data?.success) {
        toast.success(res.data.message || "Profile updated successfully!");
        fetchProfile();
      } else {
        toast.error(res.data?.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("❌ Profile update error:", err);
      toast.error("Unable to update profile");
    } finally {
      setUpdating(false);
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

  if (!profile) {
    return (
      <StudentLayout>
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">
          No profile data found.
        </p>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FaUserCircle className="mr-3 text-primary-600" />
            My Profile
          </h1>
        </div>

        {/* Profile Card */}
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b dark:border-gray-700 pb-6">
            <img
              src={
                profilePic ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-primary-600 object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {profile.name}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">{profile.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                Role: {profile.role}
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-6 grid sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Enrollment No:
              </h3>
              <p>{profile.enrollmentNo || "N/A"}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Room Number:
              </h3>
              <p>{profile.roomNumber || "Not Assigned"}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Department:
              </h3>
              <p>{profile.department || "N/A"}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Year:
              </h3>
              <p>{profile.year || "N/A"}</p>
            </div>
          </div>

          {/* Update Section */}
          <form
            onSubmit={handleUpdate}
            className="mt-8 border-t dark:border-gray-700 pt-6 space-y-4"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Update Profile
            </h2>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                Profile Picture URL
              </label>
              <input
                type="text"
                value={profilePic}
                onChange={(e) => setProfilePic(e.target.value)}
                placeholder="Paste image URL"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className={`w-full py-2 font-semibold rounded-lg text-white transition ${
                updating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {updating ? "Updating..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </StudentLayout>
  );
};

export default Profile;
