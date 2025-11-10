import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import StudentLayout from '../../components/student/StudentLayout';

const StudentVisitors = () => {
  const { user } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    visitorName: '',
    purpose: '',
    visitDate: '',
  });

  // Fetch existing visitors
  const fetchVisitors = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/student/visitors`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setVisitors(res.data.visitors || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load visitors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit visitor request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.visitorName || !formData.purpose || !formData.visitDate) {
      toast.error('Please fill all fields');
      return;
    }

    setAdding(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/student/visitors`,
        formData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success(res.data.message || 'Visitor request submitted');
      setFormData({ visitorName: '', purpose: '', visitDate: '' });
      fetchVisitors();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit visitor request');
    } finally {
      setAdding(false);
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Visitor Management
        </h1>

        {/* Add Visitor Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Request Visitor Entry
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="visitorName"
              value={formData.visitorName}
              onChange={handleChange}
              placeholder="Visitor Name"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Purpose of Visit"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <input
              type="date"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
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
          </form>
        </div>

        {/* Visitor List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Visitor Records
          </h2>
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading visitors...</p>
          ) : visitors.length ? (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-700">
                <thead className="bg-blue-600 text-white">
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
                      className="border-t hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="p-3 text-gray-800 dark:text-gray-100">{v.visitorName}</td>
                      <td className="p-3 text-gray-800 dark:text-gray-100">{v.purpose}</td>
                      <td className="p-3 text-gray-800 dark:text-gray-100">
                        {new Date(v.visitDate).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            v.status === 'Approved'
                              ? 'bg-green-100 text-green-700'
                              : v.status === 'Rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No visitor records yet.</p>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentVisitors;

