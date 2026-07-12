import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutGrid, Truck, Users, Route, Wrench, Fuel, BarChart3, ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { initials } from '../utils/format.js'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/vehicles', label: 'Vehicles', icon: Truck },
  { to: '/drivers', label: 'Drivers', icon: Users },
  { to: '/trips', label: 'Trips', icon: Route },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/fuel-expenses', label: 'Fuel & Expenses', icon: Fuel },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/access', label: 'My Access', icon: ShieldCheck },
]

export default function Sidebar() {
  const { user, roleLabel } = useAuth()

  return (
    <aside className="w-[236px] shrink-0 h-screen sticky top-0 bg-panel border-r border-line flex flex-col">
      <div className="px-5 pt-6 pb-5 border-b border-line">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-ink flex items-center justify-center shrink-0">
            <Route size={15} className="text-bg" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-[15px] tracking-tight">TRANSITOPS</span>
        </div>
        <p className="label-eyebrow mt-1.5 ml-0.5">Command Center</p>
      </div>

      <nav className="flex-1 py-3 px-3 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-md mb-0.5 text-[13px] transition-colors ${
                isActive
                  ? 'bg-ink text-bg font-medium'
                  : 'text-dim hover:text-ink hover:bg-panel2'
              }`
            }
          >
            <Icon size={15} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-line">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-md bg-panel2 border border-line">
          <div className="w-8 h-8 rounded-full bg-line2 flex items-center justify-center text-[11px] font-mono font-semibold shrink-0">
            {initials(user?.name) || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-[12.5px] font-medium truncate">{user?.name}</p>
            <p className="label-eyebrow truncate">{roleLabel}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
