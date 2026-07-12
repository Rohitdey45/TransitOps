import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach the bearer token to every request if present.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('transitops_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Normalize errors into a consistent { message } shape used across the UI.
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      'Something went wrong'
    return Promise.reject({ ...err, message, status: err?.response?.status })
  }
)

const qs = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  )
  const s = new URLSearchParams(clean).toString()
  return s ? `?${s}` : ''
}

export const api = {
  // Auth
  login: (email, password) => client.post('/auth/login', { email, password }),
  me: () => client.get('/auth/me'),

  // Vehicles
  getVehicles: (params) => client.get(`/vehicles${qs(params)}`),
  getVehicle: (id) => client.get(`/vehicles/${id}`),
  createVehicle: (body) => client.post('/vehicles', body),
  updateVehicle: (id, body) => client.patch(`/vehicles/${id}`, body),
  deleteVehicle: (id) => client.delete(`/vehicles/${id}`),
  getVehicleOperationalCost: (id) => client.get(`/vehicles/${id}/operational-cost`),

  // Drivers
  getDrivers: (params) => client.get(`/drivers${qs(params)}`),
  getDriver: (id) => client.get(`/drivers/${id}`),
  createDriver: (body) => client.post('/drivers', body),
  updateDriver: (id, body) => client.patch(`/drivers/${id}`, body),
  deleteDriver: (id) => client.delete(`/drivers/${id}`),

  // Trips
  getTrips: (params) => client.get(`/trips${qs(params)}`),
  getTrip: (id) => client.get(`/trips/${id}`),
  createTrip: (body) => client.post('/trips', body),
  dispatchTrip: (id, body) => client.patch(`/trips/${id}/dispatch`, body),
  reassignTrip: (id, body) => client.patch(`/trips/${id}/reassign`, body),
  completeTrip: (id, body) => client.patch(`/trips/${id}/complete`, body),
  cancelTrip: (id) => client.patch(`/trips/${id}/cancel`),

  // Maintenance
  getMaintenance: (params) => client.get(`/maintenance${qs(params)}`),
  createMaintenance: (body) => client.post('/maintenance', body),
  closeMaintenance: (id) => client.patch(`/maintenance/${id}/close`),

  // Fuel & Expenses
  getFuelLogs: (params) => client.get(`/fuel-logs${qs(params)}`),
  createFuelLog: (body) => client.post('/fuel-logs', body),
  getExpenses: (params) => client.get(`/expenses${qs(params)}`),
  createExpense: (body) => client.post('/expenses', body),

  // Dashboard & Reports
  getKpis: (params) => client.get(`/dashboard/kpis${qs(params)}`),
  getVehicleStatusBreakdown: () => client.get('/dashboard/vehicle-status-breakdown'),
  getFleetUtilization: () => client.get('/reports/fleet-utilization'),
  getVehicleReport: (id, revenue) => client.get(`/reports/vehicle/${id}${qs({ revenue })}`),

  // Exports (return raw blob URLs, handled separately — see utils/download.js)
}

export default api
