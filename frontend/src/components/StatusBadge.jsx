import React from 'react'

const MAP = {
  AVAILABLE: 'ok',
  ON_TRIP: 'info',
  IN_SHOP: 'warn',
  RETIRED: 'faint',
  OFF_DUTY: 'faint',
  SUSPENDED: 'err',
  DRAFT: 'faint',
  DISPATCHED: 'info',
  COMPLETED: 'ok',
  CANCELLED: 'err',
  OPEN: 'warn',
  CLOSED: 'ok',
}

const TONE_CLASSES = {
  ok: 'bg-ok/10 text-ok border-ok/30',
  info: 'bg-info/10 text-info border-info/30',
  warn: 'bg-warn/10 text-warn border-warn/30',
  err: 'bg-err/10 text-err border-err/30',
  faint: 'bg-line2/40 text-dim border-line2',
}

export default function StatusBadge({ status }) {
  const tone = MAP[status] || 'faint'
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[10.5px] tracking-wide uppercase px-2 py-1 rounded border ${TONE_CLASSES[tone]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${tone === 'ok' ? 'bg-ok' : tone === 'info' ? 'bg-info' : tone === 'warn' ? 'bg-warn' : tone === 'err' ? 'bg-err' : 'bg-dim'}`} />
      {(status || 'UNKNOWN').replace(/_/g, ' ')}
    </span>
  )
}
