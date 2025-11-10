
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const FoodMenu = () => {
  const { user } = useAuth();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/student/foodmenu`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setMenu(res.data.menu || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load food menu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [user]);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading food menu...</p>;

  if (!menu.length)
    return <p className="text-center mt-10 text-gray-600">No menu available.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Weekly Mess Food Menu
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 bg-white rounded-2xl shadow">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Day</th>
              <th className="p-3 text-left">Breakfast</th>
              <th className="p-3 text-left">Lunch</th>
              <th className="p-3 text-left">Dinner</th>
            </tr>
          </thead>
          <tbody>
            {menu.map((item, index) => (
              <tr
                key={index}
                className="border-t hover:bg-blue-50 transition text-gray-800"
              >
                <td className="p-3 font-semibold">{item.day}</td>
                <td className="p-3">{item.breakfast}</td>
                <td className="p-3">{item.lunch}</td>
                <td className="p-3">{item.dinner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FoodMenu;
