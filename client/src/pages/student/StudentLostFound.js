import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const LostFound = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    type: 'Lost',
    location: '',
  });
  const [adding, setAdding] = useState(false);

  // Fetch all lost & found reports
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/student/lostfound`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(res.data.items || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load lost & found data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit new lost/found report
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.itemName || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    setAdding(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/student/lostfound`,
        formData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success(res.data.message || 'Report added successfully!');
      setFormData({ itemName: '', description: '', type: 'Lost', location: '' });
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading lost & found items...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Lost & Found</h1>

      {/* Add Lost/Found Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow mb-10"
      >
        <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
          Report Lost / Found Item
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            placeholder="Item Name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Description"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={adding}
            className={`w-full py-2 font-semibold rounded-lg text-white ${
              adding ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {adding ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>

      {/* Lost & Found List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length ? (
          items.map((item) => (
            <div
              key={item._id}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.type === 'Lost'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {item.type}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(item.dateReported).toLocaleDateString()}
                </span>
              </div>

              <h2 className="font-semibold text-lg text-gray-800 mb-1">
                {item.itemName}
              </h2>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>

              {item.location && (
                <p className="text-sm text-gray-500">📍 {item.location}</p>
              )}

              <p
                className={`text-xs mt-3 font-medium ${
                  item.status === 'Returned'
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }`}
              >
                Status: {item.status}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No lost or found reports yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default LostFound;

