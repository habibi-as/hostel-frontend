import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const res = await API.get("/api/rooms");
      setRooms(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Room Management</h1>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto">
        {loading ? (
          <p>Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p>No rooms available</p>
        ) : (
          <table className="w-full text-sm">
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
                <tr key={r._id} className="border-b dark:border-gray-700">
                  <td className="p-2">{r.roomNumber}</td>
                  <td className="p-2">{r.roomType}</td>
                  <td className="p-2">{r.capacity}</td>
                  <td className="p-2">{r.occupied}</td>
                  <td className="p-2">{r.capacity - r.occupied}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRooms;
