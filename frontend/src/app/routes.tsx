import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Layout from '../components/layout/Layout';

import Dashboard from '../pages/Dashboard/Dashboard';
import Journal from '../components/journal/Journal';
import Mood from '../components/mood/Mood';
import Meetings from '../components/meetings/Meetings';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';

import AiInsights from '../pages/AiInsights/AiInsights';
import RiskAnalysis from '../pages/RiskAnalysis/RiskAnalysis';
import SupportNetwork from '../pages/SupportNetwork/SupportNetwork';
import EmergencyContacts from '../pages/EmergencyContacts/EmergencyContacts';
import Notifications from '../pages/Notifications/Notifications';

export default function AppRoutes() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/journal" element={
        <ProtectedRoute>
          <Layout><Journal /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/mood" element={
        <ProtectedRoute>
          <Layout><Mood /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/meetings" element={
        <ProtectedRoute>
          <Layout><Meetings /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/ai" element={
        <ProtectedRoute>
          <Layout><AiInsights /></Layout>
        </ProtectedRoute>} />

      <Route path="/risk" element={
        <ProtectedRoute>
          <Layout><RiskAnalysis /></Layout>
        </ProtectedRoute>} />

      <Route path="/support" element={
        <ProtectedRoute>
          <Layout><SupportNetwork /></Layout>
        </ProtectedRoute>} />

      <Route path="/emergency" element={
        <ProtectedRoute>
          <Layout><EmergencyContacts /></Layout>
        </ProtectedRoute>} />

      <Route path="/notifications" element={
        <ProtectedRoute>
          <Layout><Notifications /></Layout>
        </ProtectedRoute>} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
