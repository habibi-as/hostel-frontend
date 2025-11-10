import React, { useEffect, useState } from "react";
import StudentLayout from "../../components/student/StudentLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../utils/api";
import QrReader from "react-qr-scanner";
import toast from "react-hot-toast";
import { FaQrcode, FaCalendarCheck, FaChartLine } from "react-icons/fa";

const StudentAttendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (user?._id || user?.id) fetchAttendance();
  }, [user]);

  // ✅ Fetch attendance records from backend
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      // ✅ FIXED: removed duplicate /api
      const res = await API.get(`/attendance/student/${user?.id || user?._id}`);

      if (res.data?.success) {
        setAttendance(res.data.data.records || []);
        setPercentage(res.data.data.attendancePercentage || 0);
      } else {
        toast.error(res.data?.message || "Failed to load attendance data");
      }
    } catch (err) {
      console.error("Fetch attendance error:", err);
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle QR Scan result
  const handleScan = async (data) => {
    if (data && !scanning) {
      setScanning(true);
      try {
        const qrCode = btoa(
          JSON.stringify({ studentId: user?.id || user?._id, date: new Date() })
        );

        // ✅ FIXED: removed duplicate /api
        const res = await API.post("/attendance/mark", { qrCode });

        if (res.data?.success) {
          toast.success(res.data.message || "Attendance marked!");
          setShowScanner(false);
          fetchAttendance();
        } else {
          toast.error(res.data?.message || "Failed to mark attendance");
        }
      } catch (error) {
        console.error("QR mark error:", error);
        toast.error("QR marking failed");
      } finally {
        setTimeout(() => setScanning(false), 2000); // prevents rapid re-scans
      }
    }
  };

  const handleError = (err) => {
    console.error("QR error:", err);
    toast.error("Unable to access camera");
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FaCalendarCheck className="mr-2 text-primary-600" />
            Attendance
          </h1>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="card-content py-6">
              <FaChartLine className="mx-auto text-primary-600 text-4xl mb-2" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Attendance Rate
              </h3>
              <p className="text-3xl font-bold text-primary-600">
                {percentage || 0}%
              </p>
            </div>
          </div>

          <div className="card text-center">
            <div className="card-content py-6">
              <FaCalendarCheck className="mx-auto text-green-600 text-4xl mb-2" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Days Present
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {attendance.filter((a) => a.status === "present").length}
              </p>
            </div>
          </div>

          <div className="card text-center">
            <div className="card-content py-6">
              <FaCalendarCheck className="mx-auto text-red-500 text-4xl mb-2" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Days Absent
              </h3>
              <p className="text-3xl font-bold text-red-500">
                {attendance.filter((a) => a.status === "absent").length}
              </p>
            </div>
          </div>
        </div>

        {/* QR Scanner Section */}
        <div className="text-center mt-6">
          {!showScanner ? (
            <button
              onClick={() => setShowScanner(true)}
              className="btn btn-primary flex items-center mx-auto"
            >
              <FaQrcode className="mr-2" /> Scan QR to Mark Attendance
            </button>
          ) : (
            <div className="card mt-4 p-4">
              <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: "100%" }}
              />
              <button
                onClick={() => setShowScanner(false)}
                className="btn btn-outline mt-3"
              >
                Cancel Scanner
              </button>
            </div>
          )}
        </div>

        {/* Attendance Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="card mt-6">
            <div className="card-header">
              <h3 className="card-title">Recent Attendance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left text-gray-800 dark:text-gray-300">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Check-In</th>
                    <th className="px-4 py-2">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a) => (
                    <tr
                      key={a._id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                    >
                      <td className="px-4 py-2">
                        {new Date(a.date).toLocaleDateString()}
                      </td>
                      <td
                        className={`px-4 py-2 font-semibold ${
                          a.status === "present"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {a.status}
                      </td>
                      <td className="px-4 py-2">{a.checkIn || "—"}</td>
                      <td className="px-4 py-2">{a.method || "QR"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentAttendance;
