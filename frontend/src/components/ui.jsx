import React from 'react'
import { Loader2, Inbox, AlertTriangle } from 'lucide-react'

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const sizes = { sm: 'px-3 py-1.5 text-[12px]', md: 'px-4 py-2.5 text-[13px]' }
  const variants = {
    primary: 'bg-ink text-bg hover:bg-white font-medium',
    secondary: 'bg-transparent border border-line text-ink hover:border-line2 hover:bg-panel2',
    danger: 'bg-err/10 text-err border border-err/40 hover:bg-err/20',
    ghost: 'bg-transparent text-dim hover:text-ink',
  }
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 py-16 text-dim">
      <Loader2 size={20} className="animate-spin" />
      <p className="text-[12.5px] font-mono">{label}</p>
    </div>
  )
}

export function EmptyState({ title, hint, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 py-16 text-center border border-dashed border-line rounded-lg">
      <Inbox size={22} className="text-faint" />
      <p className="text-[13px] font-medium text-ink">{title}</p>
      {hint && <p className="text-dim text-[12.5px] max-w-xs">{hint}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ message }) {
  return (
    <div className="flex items-center gap-2.5 py-4 px-4 border border-err/30 bg-err/5 rounded-lg text-err">
      <AlertTriangle size={16} className="shrink-0" />
      <p className="text-[12.5px]">{message}</p>
    </div>
  )
}
