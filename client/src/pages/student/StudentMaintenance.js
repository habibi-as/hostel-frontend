import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Maintenance = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    roomNumber: '',
  });

  // Fetch all maintenance requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/student/maintenance`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load maintenance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit new maintenance request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.description || !formData.roomNumber) {
      toast.error('Please fill all fields');
      return;
    }

    setAdding(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/student/maintenance`,
        formData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success(res.data.message || 'Request submitted successfully');
      setFormData({ category: '', description: '', roomNumber: '' });
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading maintenance requests...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Maintenance Requests
      </h1>

      {/* Add Maintenance Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow mb-10"
      >
        <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
          Report Maintenance Issue
        </h2>

        <div className="space-y-4">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Describe the issue..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={adding}
            className={`w-full py-2 font-semibold rounded-lg text-white ${
              adding ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {adding ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>

      {/* Requests List */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
        <table className="w-full border border-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Room</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} className="border-t hover:bg-blue-50 transition">
                <td className="p-3 text-gray-700">
                  {new Date(req.dateReported).toLocaleDateString()}
                </td>
                <td className="p-3 text-gray-700">{req.category}</td>
                <td className="p-3 text-gray-700">{req.roomNumber}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      req.status === 'Resolved'
                        ? 'bg-green-100 text-green-700'
                        : req.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!requests.length && (
          <p className="text-center text-gray-500 py-6">No maintenance requests yet.</p>
        )}
      </div>
    </div>
  );
};

export default Maintenance;

