import React from 'react'

export default function StatCard({ label, value, unit, hint, icon: Icon, tone = 'default', dividerRight }) {
  const toneClasses = {
    default: 'text-ink',
    ok: 'text-ok',
    warn: 'text-warn',
    err: 'text-err',
  }
  return (
    <div className={`bg-panel border border-line rounded-lg px-5 py-4 ${dividerRight ? 'border-r-2 border-r-line2' : ''}`}>
      <div className="flex items-center justify-between mb-2.5">
        <p className="label-eyebrow">{label}</p>
        {Icon && <Icon size={13} className="text-faint" />}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`font-display font-semibold text-[28px] leading-none tabular-nums ${toneClasses[tone]}`}>{value}</span>
        {unit && <span className="text-dim text-[13px]">{unit}</span>}
      </div>
      {hint && <p className="text-faint text-[11.5px] mt-2">{hint}</p>}
    </div>
  )
}
