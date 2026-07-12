import React, { useEffect, useMemo, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Truck, CheckCircle2, Wrench, Route, Clock, Users, Gauge, AlertTriangle, TrendingUp, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import StatCard from '../components/StatCard.jsx'
import { Button, Loader, ErrorState } from '../components/ui.jsx'
import { Select } from '../components/Field.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/client.js'
import { daysUntil, formatDate } from '../utils/format.js'

const STATUS_COLORS = { AVAILABLE: '#34d399', ON_TRIP: '#4fb0ff', IN_SHOP: '#f5a623', RETIRED: '#5a5f68' }

export default function Dashboard() {
  const { user, can } = useAuth()
  const [kpis, setKpis] = useState(null)
  const [breakdown, setBreakdown] = useState([])
  const [drivers, setDrivers] = useState([])
  const [trips, setTrips] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([
      api.getKpis({ type, status }),
      api.getVehicleStatusBreakdown(),
      api.getDrivers(),
      api.getTrips(),
      api.getVehicles(),
    ])
      .then(([k, b, d, t, v]) => {
        if (!active) return
        setKpis(k.data)
        setBreakdown(b.data)
        setDrivers(d.data)
        setTrips(t.data)
        setVehicles(v.data)
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [type, status])

  const expiringDrivers = useMemo(() => {
    return drivers
      .map((d) => ({ ...d, daysLeft: daysUntil(d.licenseExpiry) }))
      .filter((d) => d.daysLeft !== null && d.daysLeft <= 30)
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 5)
  }, [drivers])

  const fleetHealth = useMemo(() => {
    if (!vehicles.length) return 0
    const healthy = vehicles.filter((v) => v.status === 'AVAILABLE' || v.status === 'ON_TRIP').length
    return Math.round((healthy / vehicles.length) * 100)
  }, [vehicles])

  const vehicleUsage = useMemo(() => {
    const counts = {}
    trips.filter((t) => t.status === 'COMPLETED').forEach((t) => {
      counts[t.vehicleId] = (counts[t.vehicleId] || 0) + 1
    })
    const withNames = Object.entries(counts).map(([vehicleId, count]) => {
      const v = vehicles.find((v) => v.id === vehicleId)
      return { vehicleId, count, name: v ? `${v.name} (${v.regNumber})` : vehicleId.slice(0, 8) }
    })
    const used = withNames.sort((a, b) => b.count - a.count).slice(0, 3)
    const idle = vehicles
      .filter((v) => !counts[v.id] && v.status !== 'RETIRED')
      .slice(0, 3)
      .map((v) => ({ vehicleId: v.id, name: `${v.name} (${v.regNumber})` }))
    return { used, idle }
  }, [trips, vehicles])

  const pieData = breakdown.map((b) => ({ name: b.status, value: b.count }))
  const hasBreakdownData = pieData.some((d) => d.value > 0)

  return (
    <PageLayout
      title="Dashboard"
      subtitle={`Welcome back, ${user?.name || 'operator'}. Here's your fleet at a glance.`}
      actions={
        can.manageVehicles && (
          <Link to="/vehicles">
            <Button size="sm"><Plus size={14} /> Register Vehicle</Button>
          </Link>
        )
      }
    >
      <div className="flex items-center gap-2.5 mb-6">
        <Select value={type} onChange={(e) => setType(e.target.value)} className="w-40">
          <option value="">All Types</option>
          <option value="Semi">Semi</option>
          <option value="Light">Light</option>
          <option value="Box Truck">Box Truck</option>
          <option value="Van">Van</option>
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-44">
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="ON_TRIP">On Trip</option>
          <option value="IN_SHOP">In Shop</option>
          <option value="RETIRED">Retired</option>
        </Select>
      </div>

      {error && <div className="mb-5"><ErrorState message={error} /></div>}
      {loading ? (
        <Loader label="Loading fleet data…" />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            <StatCard label="Active Vehicles" value={kpis?.activeVehicles ?? 0} icon={Truck} />
            <StatCard label="Available" value={kpis?.availableVehicles ?? 0} icon={CheckCircle2} tone="ok" />
            <StatCard label="In Maintenance" value={kpis?.vehiclesInMaintenance ?? 0} icon={Wrench} tone="warn" />
            <StatCard label="Active Trips" value={kpis?.activeTrips ?? 0} icon={Route} tone="info" />
            <StatCard label="Pending Trips" value={kpis?.pendingTrips ?? 0} icon={Clock} />
            <StatCard label="Drivers On Duty" value={kpis?.driversOnDuty ?? 0} icon={Users} />
            <StatCard label="Fleet Utilization" value={((kpis?.fleetUtilization ?? 0) * 100).toFixed(0)} unit="%" icon={Gauge} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Status breakdown chart */}
            <div className="bg-panel border border-line rounded-lg p-5 lg:col-span-1">
              <p className="label-eyebrow mb-4">Vehicle Status Breakdown</p>
              {hasBreakdownData ? (
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                        {pieData.map((d, i) => (
                          <Cell key={i} fill={STATUS_COLORS[d.name] || '#5a5f68'} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#16181c', border: '1px solid #25282e', borderRadius: 8, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-faint text-[12.5px] py-14 text-center">No vehicle data yet</p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1">
                {breakdown.map((b) => (
                  <div key={b.status} className="flex items-center gap-1.5 text-[11.5px] text-dim">
                    <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[b.status] }} />
                    {b.status.replace('_', ' ')} <span className="text-ink font-mono">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fleet health + license alerts */}
            <div className="bg-panel border border-line rounded-lg p-5">
              <p className="label-eyebrow mb-3">Fleet Health Score</p>
              <div className="flex items-end gap-2 mb-3">
                <span className="font-display font-semibold text-[38px] leading-none">{fleetHealth}%</span>
                <TrendingUp size={16} className="text-ok mb-1.5" />
              </div>
              <div className="w-full h-1.5 bg-panel2 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-ok rounded-full transition-all" style={{ width: `${fleetHealth}%` }} />
              </div>
              <p className="text-faint text-[11.5px]">Share of fleet Available or On Trip (not In Shop / Retired)</p>
            </div>

            <div className="bg-panel border border-line rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-warn" />
                <p className="label-eyebrow">Drivers Needing Attention</p>
              </div>
              {expiringDrivers.length === 0 ? (
                <p className="text-faint text-[12.5px]">No licenses expiring within 30 days.</p>
              ) : (
                <div className="space-y-2">
                  {expiringDrivers.map((d) => (
                    <div key={d.id} className="flex items-center justify-between text-[12.5px]">
                      <span className="truncate">{d.name}</span>
                      <span className={`font-mono shrink-0 ml-2 ${d.daysLeft < 0 ? 'text-err' : d.daysLeft <= 7 ? 'text-warn' : 'text-dim'}`}>
                        {d.daysLeft < 0 ? 'Expired' : `${d.daysLeft}d left`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-panel border border-line rounded-lg p-5">
              <p className="label-eyebrow mb-3">Most-Used Vehicles</p>
              {vehicleUsage.used.length === 0 ? (
                <p className="text-faint text-[12.5px]">No completed trips recorded yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {vehicleUsage.used.map((v, i) => (
                    <div key={v.vehicleId} className="flex items-center gap-3">
                      <span className="font-mono text-faint text-[11px] w-4">{i + 1}</span>
                      <span className="text-[12.5px] flex-1 truncate">{v.name}</span>
                      <span className="font-mono text-[11.5px] text-dim">{v.count} trips</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-panel border border-line rounded-lg p-5">
              <p className="label-eyebrow mb-3">Idle Vehicles</p>
              {vehicleUsage.idle.length === 0 ? (
                <p className="text-faint text-[12.5px]">Every active vehicle has logged a trip.</p>
              ) : (
                <div className="space-y-2.5">
                  {vehicleUsage.idle.map((v) => (
                    <div key={v.vehicleId} className="flex items-center justify-between text-[12.5px]">
                      <span className="truncate">{v.name}</span>
                      <span className="font-mono text-faint text-[11px]">0 trips</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </PageLayout>
  )
}
