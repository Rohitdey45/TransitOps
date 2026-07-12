const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

// Export endpoints stream binary/CSV content, so they're fetched directly
// rather than through the JSON axios client.
export async function downloadFile(path) {
  const token = localStorage.getItem('transitops_token')
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Export failed (${res.status})`)
  }
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = path.split('/').pop().split('?')[0]
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
