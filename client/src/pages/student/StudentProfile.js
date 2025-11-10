import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [phone, setPhone] = useState('');
  const [profilePic, setProfilePic] = useState('');

  // Fetch student profile data
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/student/profile`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProfile(res.data.student);
      setPhone(res.data.student.phone || '');
      setProfilePic(res.data.student.profilePic || '');
    } catch (err) {
      console.error(err);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  // Update profile info
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/student/profile`,
        { phone, profilePic },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success(res.data.message || 'Profile updated successfully');
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;

  if (!profile)
    return <p className="text-center mt-10 text-gray-600">No profile found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        My Profile
      </h1>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={
              profilePic ||
              'https://cdn-icons-png.flaticon.com/512/149/149071.png'
            }
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {profile.name}
            </h2>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-gray-500 text-sm">Role: {profile.role}</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4 text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-800">Enrollment No:</h3>
            <p>{profile.enrollmentNo || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Room Number:</h3>
            <p>{profile.roomNumber || 'Not Assigned'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Department:</h3>
            <p>{profile.department || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Year:</h3>
            <p>{profile.year || 'N/A'}</p>
          </div>
        </div>

        {/* Update Section */}
        <form onSubmit={handleUpdate} className="mt-8 border-t pt-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Update Profile
          </h2>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Profile Picture URL
            </label>
            <input
              type="text"
              value={profilePic}
              onChange={(e) => setProfilePic(e.target.value)}
              placeholder="Paste image URL"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className={`w-full py-2 font-semibold rounded-lg text-white ${
              updating ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {updating ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

