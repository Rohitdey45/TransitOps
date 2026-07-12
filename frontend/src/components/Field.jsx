import React from 'react'

const base = 'w-full bg-panel2 border border-line rounded-md px-3 py-2 text-[13px] text-ink placeholder:text-faint focus:border-line2 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

export function Field({ label, hint, required, children }) {
  return (
    <label className="block mb-3.5">
      <span className="label-eyebrow block mb-1.5">
        {label} {required && <span className="text-err">*</span>}
      </span>
      {children}
      {hint && <span className="block text-faint text-[11px] mt-1">{hint}</span>}
    </label>
  )
}

export function Input({ className = '', ...props }) {
  return <input className={`${base} font-mono ${className}`} {...props} />
}

export function Select({ children, className = '', ...props }) {
  return (
    <select className={`${base} font-mono appearance-none ${className}`} {...props}>
      {children}
    </select>
  )
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`${base} min-h-[80px] resize-y ${className}`} {...props} />
}
