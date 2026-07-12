import React, { useEffect, useState } from 'react'
import { Bell, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ title, subtitle, actions }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 bg-bg/85 backdrop-blur border-b border-line">
      <div className="flex items-center gap-4 px-8 py-5">
        <div className="min-w-0">
          <h1 className="font-display font-semibold text-[20px] tracking-tight leading-none">{title}</h1>
          {subtitle && <p className="text-dim text-[13px] mt-1.5 max-w-xl">{subtitle}</p>}
        </div>

        <div className="ml-auto flex items-center gap-3 shrink-0">
          {actions}
          <span className="hidden md:block font-mono text-[12px] text-faint tabular-nums mr-1">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </span>
          <button className="w-9 h-9 rounded-md border border-line flex items-center justify-center text-dim hover:text-ink hover:border-line2 transition-colors">
            <Bell size={15} />
          </button>
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-md border border-line flex items-center justify-center text-dim hover:text-err hover:border-err/40 transition-colors"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  )
}
