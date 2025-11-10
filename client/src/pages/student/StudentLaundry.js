import React, { useEffect, useState } from "react";
import StudentLayout from "../../components/student/StudentLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { FaTshirt } from "react-icons/fa";

const Laundry = () => {
  const { user } = useAuth();
  const [laundryList, setLaundryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clothesCount, setClothesCount] = useState("");
  const [adding, setAdding] = useState(false);

  // ✅ Fetch laundry records
  const fetchLaundry = async () => {
    try {
      setLoading(true);
      const res = await API.get("/student/laundry");

      if (res.data?.success) {
        setLaundryList(res.data.laundry || []);
      } else {
        toast.error(res.data?.message || "Failed to load laundry data");
      }
    } catch (err) {
      console.error("❌ Laundry fetch error:", err);
      toast.error("Unable to fetch laundry data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaundry();
  }, []);

  // ✅ Add new laundry request
  const handleAddLaundry = async (e) => {
    e.preventDefault();
    if (!clothesCount) {
      toast.error("Please enter number of clothes");
      return;
    }

    setAdding(true);
    try {
      const res = await API.post("/student/laundry", { clothesCount });

      if (res.data?.success) {
        toast.success(res.data.message || "Laundry request added successfully!");
        setClothesCount("");
        fetchLaundry();
      } else {
        toast.error(res.data?.message || "Failed to add laundry");
      }
    } catch (err) {
      console.error("❌ Laundry add error:", err);
      toast.error("Unable to add laundry request");
    } finally {
      setAdding(false);
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

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FaTshirt className="mr-3 text-primary-600" />
            Laundry Management
          </h1>
        </div>

        {/* Add Laundry Form */}
        <form
          onSubmit={handleAddLaundry}
          className="max-w-md mx-auto bg-white dark:bg-gray-800 p-5 rounded-2xl shadow mb-8"
        >
          <h2 className="text-lg font-semibold mb-3 text-center text-gray-900 dark:text-white">
            Add Laundry Request
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              value={clothesCount}
              onChange={(e) => setClothesCount(e.target.value)}
              placeholder="No. of clothes"
              className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={adding}
              className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
                adding
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {adding ? "Adding..." : "Add"}
            </button>
          </div>
        </form>

        {/* Laundry List */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
          {laundryList.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-6">
              No laundry records yet.
            </p>
          ) : (
            <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-primary-600 text-white">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Clothes</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {laundryList.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                  >
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      {item.clothesCount}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === "Delivered"
                            ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                            : item.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300"
                            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {item.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default Laundry;


