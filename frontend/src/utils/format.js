export function formatCurrency(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)
}

export function formatNumber(n, digits = 0) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(n)
}

export function formatDate(d) {
  if (!d) return '—'
  const date = new Date(d)
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
}

export function formatDateTime(d) {
  if (!d) return '—'
  const date = new Date(d)
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export function daysUntil(d) {
  if (!d) return null
  const target = new Date(d)
  if (isNaN(target.getTime())) return null
  const now = new Date()
  const diff = Math.ceil((target.setHours(0,0,0,0) - now.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24))
  return diff
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}
