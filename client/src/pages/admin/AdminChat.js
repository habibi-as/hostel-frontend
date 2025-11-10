
import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all chat messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      // ✅ FIX: removed extra `/api`
      const res = await API.get("/chat");

      if (res.data?.success) {
        setMessages(res.data.data || []);
      } else {
        toast.error(res.data?.message || "Failed to load chat messages");
      }
    } catch (err) {
      console.error("❌ Chat fetch error:", err);
      toast.error(err.response?.data?.message || "Failed to load chat");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Send a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;

    try {
      // ✅ FIX: removed `/api`
      const res = await API.post("/chat", { message: msg });

      if (res.data?.success) {
        setMsg("");
        fetchMessages(); // reload chat
      } else {
        toast.error(res.data?.message || "Failed to send message");
      }
    } catch (err) {
      console.error("❌ Send message error:", err);
      toast.error(err.response?.data?.message || "Failed to send message");
    }
  };

  useEffect(() => {
    fetchMessages();
    // Optionally, refresh chat every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Chat
        </h1>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-[70vh] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-3 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
            {loading ? (
              <p className="text-gray-500">Loading chat...</p>
            ) : messages.length === 0 ? (
              <p className="text-gray-500 text-center">No messages yet</p>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-2 ${
                    m.sender === "admin" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block px-3 py-2 rounded-lg ${
                      m.sender === "admin"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message input */}
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type message..."
              className="input flex-1"
            />
            <button
              type="submit"
              className="btn bg-blue-600 hover:bg-blue-700 text-white"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminChat;
