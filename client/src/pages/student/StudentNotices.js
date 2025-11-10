import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Notice = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notices from backend
  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/student/notice`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotices(res.data.notices || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [user]);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading notices...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Hostel Notice Board
      </h1>

      {notices.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices
            .slice()
            .reverse() // show newest first
            .map((notice) => (
              <div
                key={notice._id}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition border-l-4 border-blue-500"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {notice.title}
                </h2>
                <p className="text-gray-600 text-sm mb-3">{notice.description}</p>
                {notice.link && (
                  <a
                    href={notice.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    View Details
                  </a>
                )}
                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                  <span>📅 {new Date(notice.date).toLocaleDateString()}</span>
                  <span>👤 {notice.postedBy || 'Admin'}</span>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No notices available.</p>
      )}
    </div>
  );
};

export default Notice;
