import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../utils/api";
import toast from "react-hot-toast";

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await API.get("/api/chat");
      setMessages(res.data.data || []);
    } catch {
      toast.error("Failed to load chat");
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    try {
      await API.post("/api/chat", { message: msg });
      setMsg("");
      fetchMessages();
    } catch {
      toast.error("Failed to send message");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Admin Chat</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-[70vh] flex flex-col">
        <div className="flex-1 overflow-y-auto mb-3">
          {messages.map((m, i) => (
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
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {m.message}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type message..."
            className="input flex-1"
          />
          <button className="btn bg-blue-600 text-white hover:bg-blue-700">
            Send
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminChat;
