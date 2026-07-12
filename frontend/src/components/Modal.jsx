import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, subtitle, children, width = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10 px-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${width} bg-panel border border-line2 rounded-xl shadow-2xl shadow-black/60 animate-fade-in`}>
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-line">
          <div>
            <h2 className="font-display font-semibold text-[16px]">{title}</h2>
            {subtitle && <p className="text-dim text-[12.5px] mt-1">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-dim hover:text-ink shrink-0 mt-0.5">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
