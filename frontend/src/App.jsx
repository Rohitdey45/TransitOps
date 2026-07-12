import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Vehicles from './pages/Vehicles.jsx'
import Drivers from './pages/Drivers.jsx'
import Trips from './pages/Trips.jsx'
import Maintenance from './pages/Maintenance.jsx'
import FuelExpenses from './pages/FuelExpenses.jsx'
import Reports from './pages/Reports.jsx'
import Access from './pages/Access.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
      <Route path="/drivers" element={<ProtectedRoute><Drivers /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
      <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
      <Route path="/fuel-expenses" element={<ProtectedRoute><FuelExpenses /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/access" element={<ProtectedRoute><Access /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
