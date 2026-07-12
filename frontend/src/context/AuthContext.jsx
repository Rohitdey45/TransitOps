import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../api/client.js'

const AuthContext = createContext(null)

const ROLE_LABELS = {
  FLEET_MANAGER: 'Fleet Manager',
  DRIVER: 'Driver',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const restoreSession = useCallback(async () => {
    const token = localStorage.getItem('transitops_token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const { data } = await api.me()
      setUser(data.user)
    } catch (e) {
      localStorage.removeItem('transitops_token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  const login = async (email, password) => {
    const { data } = await api.login(email, password)
    localStorage.setItem('transitops_token', data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('transitops_token')
    setUser(null)
  }

  const role = user?.role
  const can = {
    manageVehicles: role === 'FLEET_MANAGER',
    manageDriversFull: role === 'FLEET_MANAGER',
    manageDriversLimited: role === 'SAFETY_OFFICER',
    manageTrips: role === 'FLEET_MANAGER' || role === 'DRIVER',
    manageMaintenance: role === 'FLEET_MANAGER' || role === 'SAFETY_OFFICER',
    logFuel: role === 'FLEET_MANAGER' || role === 'DRIVER',
    logExpenses: role === 'FLEET_MANAGER',
    exportReports: role === 'FLEET_MANAGER' || role === 'FINANCIAL_ANALYST',
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, role, roleLabel: ROLE_LABELS[role] || role, can }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { ROLE_LABELS }
