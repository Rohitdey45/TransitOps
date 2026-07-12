import React from 'react'
import { Check, X } from 'lucide-react'
import PageLayout from '../components/PageLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { formatDateTime } from '../utils/format.js'

const MATRIX = [
  { area: 'Vehicles', view: 'ALL', manage: 'Fleet Manager' },
  { area: 'Drivers', view: 'ALL', manage: 'Fleet Manager (full) · Safety Officer (status & score)' },
  { area: 'Trips', view: 'ALL', manage: 'Fleet Manager · Driver' },
  { area: 'Maintenance', view: 'ALL', manage: 'Fleet Manager · Safety Officer' },
  { area: 'Fuel Logs', view: 'ALL', manage: 'Fleet Manager · Driver' },
  { area: 'Expenses', view: 'ALL', manage: 'Fleet Manager' },
  { area: 'Reports & Exports', view: 'ALL', manage: 'Fleet Manager · Financial Analyst (export)' },
]

export default function Access() {
  const { user, role, roleLabel, can } = useAuth()

  const rows = [
    ['Manage Vehicles', can.manageVehicles],
    ['Manage Drivers (full)', can.manageDriversFull],
    ['Manage Drivers (status & score only)', can.manageDriversLimited],
    ['Create / Dispatch / Complete Trips', can.manageTrips],
    ['Manage Maintenance Records', can.manageMaintenance],
    ['Log Fuel Purchases', can.logFuel],
    ['Log Expenses', can.logExpenses],
    ['Export Reports (CSV / PDF)', can.exportReports],
  ]

  return (
    <PageLayout title="My Access" subtitle="Your current role, session, and permission scope.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-panel border border-line rounded-lg p-5">
          <p className="label-eyebrow mb-2">Signed in as</p>
          <p className="text-[15px] font-medium mb-0.5">{user?.name}</p>
          <p className="text-dim text-[12.5px]">{user?.email}</p>
        </div>
        <div className="bg-panel border border-line rounded-lg p-5">
          <p className="label-eyebrow mb-2">Role</p>
          <p className="text-[15px] font-medium font-mono">{roleLabel}</p>
        </div>
        <div className="bg-panel border border-line rounded-lg p-5">
          <p className="label-eyebrow mb-2">Session Issued</p>
          <p className="text-[13px] font-mono text-dim">{user?.iat ? formatDateTime(user.iat * 1000) : '—'}</p>
        </div>
      </div>

      <div className="bg-panel border border-line rounded-lg p-5 mb-6">
        <p className="label-eyebrow mb-4">Your Permissions</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
          {rows.map(([label, allowed]) => (
            <div key={label} className="flex items-center gap-2.5 text-[13px]">
              {allowed ? <Check size={14} className="text-ok shrink-0" /> : <X size={14} className="text-faint shrink-0" />}
              <span className={allowed ? 'text-ink' : 'text-faint'}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-panel border border-line rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-line">
          <p className="label-eyebrow">Platform-wide Access Matrix</p>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-line">
              {['Area', 'Viewing', 'Management'].map((h) => (
                <th key={h} className="label-eyebrow px-5 py-3 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MATRIX.map((m) => (
              <tr key={m.area} className="border-b border-line last:border-0">
                <td className="px-5 py-3 text-[13px]">{m.area}</td>
                <td className="px-5 py-3 text-[12.5px] text-dim font-mono">{m.view} roles</td>
                <td className="px-5 py-3 text-[12.5px] text-dim">{m.manage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageLayout>
  )
}
