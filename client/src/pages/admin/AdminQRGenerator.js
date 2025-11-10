import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import API from "../../utils/api";
import QRCode from "qrcode.react";
import { FaQrcode, FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";

const AdminQRGenerator = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [qrData, setQrData] = useState("");
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Fetch all students (only with role=student)
  const fetchStudents = async () => {
    try {
      setLoading(true);
      // ✅ FIXED: removed duplicate `/api`
      const res = await API.get("/users?role=student");

      if (res.data?.success && res.data?.data?.users) {
        setStudents(res.data.data.users);
      } else {
        toast.error(res.data?.message || "Failed to fetch student list");
      }
    } catch (err) {
      console.error("❌ Fetch students error:", err);
      toast.error(err.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Generate encoded QR data
  const handleGenerate = () => {
    if (!selectedStudent) {
      toast.error("Please select a student first");
      return;
    }

    const payload = {
      studentId: selectedStudent,
      date: new Date(date).toISOString(),
      issuedBy: user?.name || "Admin",
    };

    const encoded = btoa(JSON.stringify(payload));
    setQrData(encoded);
    toast.success("✅ QR generated successfully!");
  };

  // 📸 Download QR as PNG image
  const handleDownload = () => {
    try {
      const canvas = document.getElementById("qrCanvas");
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `attendance_qr_${date}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error("❌ QR download error:", err);
      toast.error("Failed to download QR");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FaQrcode className="mr-2 text-primary-600" />
            Attendance QR Generator
          </h1>
        </div>

        {/* Selection Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Generate QR Code for a Student</h3>
          </div>
          <div className="card-content space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Dropdown */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="input w-full"
                >
                  <option value="">-- Select Student --</option>
                  {students.length > 0 ? (
                    students.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.email})
                      </option>
                    ))
                  ) : (
                    <option disabled>No students found</option>
                  )}
                </select>
              </div>

              {/* Date Input */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input w-full"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              className="btn bg-blue-600 text-white hover:bg-blue-700 mt-4"
            >
              Generate QR
            </button>
          </div>
        </div>

        {/* QR Preview Section */}
        {qrData && (
          <div className="card text-center">
            <div className="card-header">
              <h3 className="card-title">Generated QR Code</h3>
            </div>
            <div className="card-content py-6 flex flex-col items-center space-y-4">
              <QRCode
                id="qrCanvas"
                value={qrData}
                size={220}
                fgColor="#000000"
                bgColor="#ffffff"
                includeMargin={true}
              />
              <p className="text-gray-700 dark:text-gray-400">
                Student ID encoded securely for {date}
              </p>
              <button
                onClick={handleDownload}
                className="btn btn-outline flex items-center"
              >
                <FaDownload className="mr-2" /> Download QR
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminQRGenerator;
