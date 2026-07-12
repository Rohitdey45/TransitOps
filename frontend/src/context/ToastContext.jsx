import React, { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback((message, type = 'info') => {
    const id = ++idCounter
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => dismiss(id), 4500)
  }, [dismiss])

  const toast = {
    success: (msg) => push(msg, 'success'),
    error: (msg) => push(msg, 'error'),
    info: (msg) => push(msg, 'info'),
  }

  const icons = {
    success: <CheckCircle2 size={16} className="text-ok shrink-0" />,
    error: <XCircle size={16} className="text-err shrink-0" />,
    info: <Info size={16} className="text-info shrink-0" />,
  }

  const borders = {
    success: 'border-ok/40',
    error: 'border-err/40',
    info: 'border-info/40',
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-80">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-fade-in flex items-start gap-2.5 bg-panel2 border ${borders[t.type]} rounded-lg px-3.5 py-3 shadow-2xl shadow-black/50`}
          >
            {icons[t.type]}
            <p className="text-[13px] text-ink leading-snug flex-1">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="text-dim hover:text-ink shrink-0">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
