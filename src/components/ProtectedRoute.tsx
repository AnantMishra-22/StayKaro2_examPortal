import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  if (loading) return <div className="loading-screen text-white bg-[#0A0C10] h-screen flex items-center justify-center">Loading...</div>;
  if (!user || profile?.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export function MemberRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  if (loading) return <div className="loading-screen text-white bg-[#0A0C10] h-screen flex items-center justify-center">Loading...</div>;
  if (!user || profile?.role !== 'member') return <Navigate to="/member/login" replace />;
  return <>{children}</>;
}
