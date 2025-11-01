import React, { useEffect, useState } from "react";
import { getVisitors, addVisitor, checkoutVisitor, deleteVisitor } from "../../api/visitorService";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function VisitorsPage() {
  const { token } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [form, setForm] = useState({ name: "", contact: "", purpose: "", remarks: "" });

  const fetchVisitors = async () => {
    try {
      const data = await getVisitors(token);
      setVisitors(data);
    } catch (err) {
      toast.error("Failed to load visitors");
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addVisitor(token, form);
      toast.success("Visitor added!");
      setForm({ name: "", contact: "", purpose: "", remarks: "" });
      fetchVisitors();
    } catch {
      toast.error("Failed to add visitor");
    }
  };

  const handleCheckout = async (id) => {
    await checkoutVisitor(token, id);
    toast.success("Visitor checked out!");
    fetchVisitors();
  };

  const handleDelete = async (id) => {
    await deleteVisitor(token, id);
    toast.success("Visitor deleted");
    fetchVisitors();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Visitor Management</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-2 mb-4">
        <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Contact" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Purpose" value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Remarks" value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} />
        <button type="submit" className="col-span-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Add Visitor</button>
      </form>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Contact</th>
            <th className="border p-2">Purpose</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Check In</th>
            <th className="border p-2">Check Out</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map(v => (
            <tr key={v._id} className="text-center">
              <td className="border p-2">{v.name}</td>
              <td className="border p-2">{v.contact}</td>
              <td className="border p-2">{v.purpose}</td>
              <td className="border p-2">{v.status}</td>
              <td className="border p-2">{new Date(v.checkInTime).toLocaleString()}</td>
              <td className="border p-2">{v.checkOutTime ? new Date(v.checkOutTime).toLocaleString() : "-"}</td>
              <td className="border p-2 space-x-2">
                {v.status === "checked_in" && (
                  <button onClick={() => handleCheckout(v._id)} className="bg-green-500 text-white px-2 py-1 rounded">Checkout</button>
                )}
                <button onClick={() => handleDelete(v._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
