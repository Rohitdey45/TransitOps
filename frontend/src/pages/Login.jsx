import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Route, Truck, Users, Wrench, BarChart3, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const FEATURES = [
  { icon: Truck, text: 'Fleet Registry — Vehicles, capacity & lifecycle status' },
  { icon: Users, text: 'Driver Compliance — Licenses & safety scoring' },
  { icon: Wrench, text: 'Maintenance Ops — Shop status auto-sync' },
  { icon: BarChart3, text: 'Financial Insight — Cost, ROI & fuel efficiency' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Signed in successfully')
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-bg">
      {/* Left — brand panel */}
      <div className="hidden lg:flex w-[46%] flex-col justify-between border-r border-line px-14 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-panel/40 to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-ink flex items-center justify-center">
              <Route size={18} className="text-bg" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-[19px] tracking-tight">TRANSITOPS</span>
          </div>
          <p className="label-eyebrow mt-2 ml-0.5">Command Center</p>
        </div>

        <div className="relative">
          <h1 className="font-display font-semibold text-[34px] leading-[1.15] mb-4 max-w-md">
            One console for every vehicle, driver, and dispatch decision.
          </h1>
          <p className="text-dim text-[14px] max-w-md leading-relaxed">
            Replace spreadsheets and logbooks with real-time fleet visibility —
            dispatching, maintenance, fuel and cost tracking in a single operations layer.
          </p>

          <div className="mt-9 space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-[13px] text-dim">
                <div className="w-7 h-7 rounded-md border border-line flex items-center justify-center shrink-0">
                  <Icon size={13} />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        <p className="relative label-eyebrow">TransitOps Platform · v1.0</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded bg-ink flex items-center justify-center">
              <Route size={16} className="text-bg" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-[17px]">TRANSITOPS</span>
          </div>

          <h2 className="font-display font-semibold text-[22px] mb-1.5">Sign in to your account</h2>
          <p className="text-dim text-[13px] mb-8">Enter your operator credentials to continue.</p>

          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              <span className="label-eyebrow block mb-1.5">Email</span>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@transitops.com"
                className="w-full bg-panel2 border border-line rounded-md px-3.5 py-2.5 text-[13.5px] font-mono placeholder:text-faint focus:border-line2 focus:outline-none transition-colors"
              />
            </label>

            <label className="block mb-2">
              <span className="label-eyebrow block mb-1.5">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full bg-panel2 border border-line rounded-md px-3.5 py-2.5 text-[13.5px] font-mono placeholder:text-faint focus:border-line2 focus:outline-none transition-colors"
              />
            </label>

            {error && (
              <p className="text-err text-[12.5px] mt-2 bg-err/5 border border-err/30 rounded-md px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-ink text-bg font-medium text-[13.5px] rounded-md py-2.5 flex items-center justify-center gap-1.5 hover:bg-white transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading && <ArrowRight size={14} />}
            </button>
          </form>

          <p className="text-faint text-[11.5px] mt-8 leading-relaxed">
            Role-based access: Fleet Manager · Driver · Safety Officer · Financial Analyst.
            Access is provisioned by your administrator.
          </p>
        </div>
      </div>
    </div>
  )
}
