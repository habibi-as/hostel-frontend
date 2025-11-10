import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/student/events`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setEvents(res.data.events || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [user]);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading events...</p>;

  if (!events.length)
    return <p className="text-center mt-10 text-gray-600">No upcoming events.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Upcoming Events
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              {event.title}
            </h2>
            <p className="text-gray-600 text-sm mb-3">{event.description}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>📅 {new Date(event.date).toLocaleDateString()}</span>
              <span>📍 {event.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
