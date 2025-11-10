import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Laundry = () => {
  const { user } = useAuth();
  const [laundryList, setLaundryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clothesCount, setClothesCount] = useState('');
  const [adding, setAdding] = useState(false);

  // Fetch existing laundry records
  const fetchLaundry = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/student/laundry`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setLaundryList(res.data.laundry || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load laundry data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaundry();
  }, [user]);

  // Submit new laundry request
  const handleAddLaundry = async (e) => {
    e.preventDefault();
    if (!clothesCount) {
      toast.error('Enter number of clothes');
      return;
    }

    setAdding(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/student/laundry`,
        { clothesCount },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success(res.data.message || 'Laundry request added');
      setClothesCount('');
      fetchLaundry(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to add laundry');
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading laundry records...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Laundry Management
      </h1>

      {/* Add Laundry Form */}
      <form
        onSubmit={handleAddLaundry}
        className="max-w-md mx-auto bg-white p-5 rounded-2xl shadow mb-8"
      >
        <h2 className="text-lg font-semibold mb-3 text-center">Add Laundry Request</h2>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1"
            value={clothesCount}
            onChange={(e) => setClothesCount(e.target.value)}
            placeholder="No. of clothes"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={adding}
            className={`px-4 py-2 rounded-lg font-semibold text-white ${
              adding ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {adding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>

      {/* Laundry List */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
        <table className="w-full border border-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Clothes</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {laundryList.map((item) => (
              <tr key={item._id} className="border-t hover:bg-blue-50 transition">
                <td className="p-3 text-gray-700">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="p-3 text-gray-700">{item.clothesCount}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!laundryList.length && (
          <p className="text-center text-gray-500 py-6">No laundry records yet.</p>
        )}
      </div>
    </div>
  );
};

export default Laundry;

