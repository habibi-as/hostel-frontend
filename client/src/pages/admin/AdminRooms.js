import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Rooms from backend
  const fetchRooms = async () => {
    try {
      setLoading(true);
      // ✅ FIXED: removed duplicate /api
      const res = await API.get("/rooms");

      if (res.data?.success && res.data?.data) {
        setRooms(res.data.data);
      } else {
        toast.error(res.data?.message || "Failed to load room data");
      }
    } catch (err) {
      console.error("❌ Room fetch error:", err);
      toast.error(err.response?.data?.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Room Management
        </h1>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto">
          {loading ? (
            <p className="text-gray-500 text-center">Loading rooms...</p>
          ) : rooms.length === 0 ? (
            <p className="text-gray-500 text-center">No rooms available</p>
          ) : (
            <table className="w-full text-sm text-gray-800 dark:text-gray-300">
              <thead>
                <tr className="border-b dark:border-gray-700 text-left">
                  <th className="p-2">Room No</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Capacity</th>
                  <th className="p-2">Occupied</th>
                  <th className="p-2">Available</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr
                    key={r._id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                  >
                    <td className="p-2 font-semibold">{r.roomNumber}</td>
                    <td className="p-2 capitalize">{r.roomType}</td>
                    <td className="p-2">{r.capacity}</td>
                    <td className="p-2 text-red-500 font-medium">
                      {r.occupied}
                    </td>
                    <td className="p-2 text-green-600 font-medium">
                      {r.capacity - r.occupied}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRooms;

