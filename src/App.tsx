import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminRoute, MemberRoute } from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import MemberLogin from './pages/MemberLogin';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import LiveExam from './pages/LiveExam';
import Analytics from './pages/Analytics';
import QuestionBank from './pages/QuestionBank';
import Members from './pages/Members';
import Notifications from './pages/Notifications';
import ExamCreate from './pages/ExamCreate';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/member/login" element={<MemberLogin />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/members" element={<AdminRoute><Members /></AdminRoute>} />
          <Route path="/admin/exams/create" element={<AdminRoute><ExamCreate /></AdminRoute>} />
          <Route path="/admin/questions" element={<AdminRoute><QuestionBank /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
          <Route path="/admin/notifications" element={<AdminRoute><Notifications /></AdminRoute>} />

          {/* Member routes */}
          <Route path="/member/dashboard" element={<MemberRoute><MemberDashboard /></MemberRoute>} />
          <Route path="/member/analytics" element={<MemberRoute><Analytics /></MemberRoute>} />

          {/* Exam */}
          <Route path="/exam/live" element={<MemberRoute><LiveExam /></MemberRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
