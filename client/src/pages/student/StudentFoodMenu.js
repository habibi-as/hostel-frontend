import React, { useEffect, useState } from "react";
import StudentLayout from "../../components/student/StudentLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { FaUtensils } from "react-icons/fa";

const FoodMenu = () => {
  const { user } = useAuth();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  // ✅ Fetch food menu from backend
  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await API.get("/student/foodmenu");

      if (res.data?.success) {
        setMenu(res.data.menu || []);
      } else {
        toast.error(res.data?.message || "Failed to load food menu");
      }
    } catch (err) {
      console.error("❌ Food menu fetch error:", err);
      toast.error("Unable to fetch food menu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FaUtensils className="mr-3 text-primary-600" />
            Weekly Mess Food Menu
          </h1>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : menu.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No menu available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-2xl shadow bg-white dark:bg-gray-800">
              <thead className="bg-primary-600 text-white">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold uppercase tracking-wide">
                    Day
                  </th>
                  <th className="p-3 text-left text-sm font-semibold uppercase tracking-wide">
                    Breakfast
                  </th>
                  <th className="p-3 text-left text-sm font-semibold uppercase tracking-wide">
                    Lunch
                  </th>
                  <th className="p-3 text-left text-sm font-semibold uppercase tracking-wide">
                    Dinner
                  </th>
                </tr>
              </thead>
              <tbody>
                {menu.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                  >
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">
                      {item.day}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {item.breakfast || "-"}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {item.lunch || "-"}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {item.dinner || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default FoodMenu;

