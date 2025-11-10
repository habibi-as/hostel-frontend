import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminRooms from './pages/admin/AdminRooms';
import AdminFees from './pages/admin/AdminFees';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminNotices from './pages/admin/AdminNotices';
import AdminLostFound from './pages/admin/AdminLostFound';
import AdminChat from './pages/admin/AdminChat';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminReports from './pages/admin/AdminReports';
import AdminProfile from './pages/admin/AdminProfile';
import VisitorsPage from "./pages/admin/VisitorsPage";

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentFees from './pages/student/StudentFees';
import StudentNotices from './pages/student/StudentNotices';
import StudentComplaints from './pages/student/StudentComplaints';
import StudentLostFound from './pages/student/StudentLostFound';
import StudentChat from './pages/student/StudentChat';
import StudentFoodMenu from './pages/student/StudentFoodMenu';
import StudentLaundry from './pages/student/StudentLaundry';
import StudentVisitors from './pages/student/StudentVisitors';
import StudentMaintenance from './pages/student/StudentMaintenance';
import StudentEvents from './pages/student/StudentEvents';
import StudentFeedback from './pages/student/StudentFeedback';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: { fontSize: '14px' },
              }}
            />

            <Routes>
              {/* 🌍 Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* 👨‍🎓 Student Routes */}
              <Route
                path="/student/dashboard"
                element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>}
              />
              <Route
                path="/student/profile"
                element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>}
              />
              <Route
                path="/student/attendance"
                element={<ProtectedRoute role="student"><StudentAttendance /></ProtectedRoute>}
              />
              <Route
                path="/student/fees"
                element={<ProtectedRoute role="student"><StudentFees /></ProtectedRoute>}
              />
              <Route
                path="/student/notices"
                element={<ProtectedRoute role="student"><StudentNotices /></ProtectedRoute>}
              />
              <Route
                path="/student/complaints"
                element={<ProtectedRoute role="student"><StudentComplaints /></ProtectedRoute>}
              />
              <Route
                path="/student/lost-found"
                element={<ProtectedRoute role="student"><StudentLostFound /></ProtectedRoute>}
              />
              <Route
                path="/student/chat"
                element={<ProtectedRoute role="student"><StudentChat /></ProtectedRoute>}
              />
              <Route
                path="/student/food-menu"
                element={<ProtectedRoute role="student"><StudentFoodMenu /></ProtectedRoute>}
              />
              <Route
                path="/student/laundry"
                element={<ProtectedRoute role="student"><StudentLaundry /></ProtectedRoute>}
              />
              <Route
                path="/student/visitors"
                element={<ProtectedRoute role="student"><StudentVisitors /></ProtectedRoute>}
              />
              <Route
                path="/student/maintenance"
                element={<ProtectedRoute role="student"><StudentMaintenance /></ProtectedRoute>}
              />
              <Route
                path="/student/events"
                element={<ProtectedRoute role="student"><StudentEvents /></ProtectedRoute>}
              />
              <Route
                path="/student/feedback"
                element={<ProtectedRoute role="student"><StudentFeedback /></ProtectedRoute>}
              />

              {/* 🧑‍💼 Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
              />
              <Route
                path="/admin/students"
                element={<ProtectedRoute role="admin"><AdminStudents /></ProtectedRoute>}
              />
              <Route
                path="/admin/rooms"
                element={<ProtectedRoute role="admin"><AdminRooms /></ProtectedRoute>}
              />
              <Route
                path="/admin/fees"
                element={<ProtectedRoute role="admin"><AdminFees /></ProtectedRoute>}
              />
              <Route
                path="/admin/complaints"
                element={<ProtectedRoute role="admin"><AdminComplaints /></ProtectedRoute>}
              />
              <Route
                path="/admin/notices"
                element={<ProtectedRoute role="admin"><AdminNotices /></ProtectedRoute>}
              />
              <Route
                path="/admin/lost-found"
                element={<ProtectedRoute role="admin"><AdminLostFound /></ProtectedRoute>}
              />
              <Route
                path="/admin/chat"
                element={<ProtectedRoute role="admin"><AdminChat /></ProtectedRoute>}
              />
              <Route
                path="/admin/attendance"
                element={<ProtectedRoute role="admin"><AdminAttendance /></ProtectedRoute>}
              />
              <Route
                path="/admin/reports"
                element={<ProtectedRoute role="admin"><AdminReports /></ProtectedRoute>}
              />
              <Route
                path="/admin/profile"
                element={<ProtectedRoute role="admin"><AdminProfile /></ProtectedRoute>}
              />
              <Route
                path="/admin/visitors"
                element={<ProtectedRoute role="admin"><VisitorsPage /></ProtectedRoute>}
              />

              {/* 🚫 Unknown Route → Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
