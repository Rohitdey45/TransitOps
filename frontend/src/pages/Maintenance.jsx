import React, { useEffect, useState } from 'react'
import { Plus, CheckCircle2 } from 'lucide-react'
import PageLayout from '../components/PageLayout.jsx'
import Modal from '../components/Modal.jsx'
import { Field, Input, Select } from '../components/Field.jsx'
import { Button, Loader, EmptyState, ErrorState } from '../components/ui.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import api from '../api/client.js'
import { formatCurrency, formatDateTime } from '../utils/format.js'

const EMPTY_FORM = { vehicleId: '', reason: '', cost: '' }

export default function Maintenance() {
  const { can } = useAuth()
  const toast = useToast()
  const [logs, setLogs] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [vehicleFilter, setVehicleFilter] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [closeTarget, setCloseTarget] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [l, v] = await Promise.all([
        api.getMaintenance({ status: statusFilter || undefined, vehicleId: vehicleFilter || undefined }),
        api.getVehicles(),
      ])
      setLogs(l.data)
      setVehicles(v.data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [statusFilter, vehicleFilter])

  const vehicleLabel = (id) => {
    const v = vehicles.find((v) => v.id === id)
    return v ? `${v.regNumber} — ${v.name}` : id?.slice(0, 8)
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.createMaintenance({ ...form, cost: parseFloat(form.cost) })
      toast.success('Maintenance record created — vehicle moved to In Shop')
      setFormOpen(false)
      setForm(EMPTY_FORM)
      load()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const confirmClose = async () => {
    setSaving(true)
    try {
      await api.closeMaintenance(closeTarget.id)
      toast.success('Maintenance record closed — vehicle back to Available')
      setCloseTarget(null)
      load()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageLayout
      title="Maintenance"
      subtitle="Service records and vehicle shop status."
      actions={can.manageMaintenance && <Button size="sm" onClick={() => setFormOpen(true)}><Plus size={14} /> Log Maintenance</Button>}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex gap-1 bg-panel2 border border-line rounded-md p-1">
          {['', 'OPEN', 'CLOSED'].map((s) => (
            <button key={s || 'all'} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded text-[11.5px] font-mono transition-colors ${statusFilter === s ? 'bg-ink text-bg' : 'text-dim hover:text-ink'}`}>
              {s || 'ALL'}
            </button>
          ))}
        </div>
        <Select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} className="w-56">
          <option value="">All Vehicles</option>
          {vehicles.map((v) => <option key={v.id} value={v.id}>{v.regNumber} — {v.name}</option>)}
        </Select>
      </div>

      {error && <div className="mb-4"><ErrorState message={error} /></div>}

      {loading ? (
        <Loader label="Loading maintenance records…" />
      ) : logs.length === 0 ? (
        <EmptyState title="No maintenance records" hint="Log a maintenance event to take a vehicle out of dispatch." />
      ) : (
        <div className="bg-panel border border-line rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line">
                {['Vehicle', 'Reason', 'Cost', 'Opened', 'Closed', 'Status', ''].map((h) => (
                  <th key={h} className="label-eyebrow px-4 py-3 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-line last:border-0 hover:bg-panel2/60 transition-colors">
                  <td className="px-4 py-3 text-[13px]">{vehicleLabel(l.vehicleId)}</td>
                  <td className="px-4 py-3 text-[13px] text-dim">{l.reason}</td>
                  <td className="px-4 py-3 font-mono text-[12.5px]">{formatCurrency(l.cost)}</td>
                  <td className="px-4 py-3 font-mono text-[11.5px] text-dim">{formatDateTime(l.createdAt)}</td>
                  <td className="px-4 py-3 font-mono text-[11.5px] text-dim">{l.closedAt ? formatDateTime(l.closedAt) : '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                  <td className="px-4 py-3">
                    {can.manageMaintenance && l.status === 'OPEN' && (
                      <Button size="sm" variant="secondary" onClick={() => setCloseTarget(l)}><CheckCircle2 size={13} /> Close</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Log Maintenance" subtitle="Opens a service record and moves the vehicle to In Shop">
        <form onSubmit={submit}>
          <Field label="Vehicle" required>
            <Select required value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}>
              <option value="">Select vehicle…</option>
              {vehicles.filter((v) => v.status !== 'IN_SHOP' && v.status !== 'ON_TRIP').map((v) => (
                <option key={v.id} value={v.id}>{v.regNumber} — {v.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Reason" required>
            <Input required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Engine Overheat" />
          </Field>
          <Field label="Cost" required>
            <Input required type="number" step="any" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-2 mt-5">
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Logging…' : 'Log Maintenance'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!closeTarget} onClose={() => setCloseTarget(null)} title="Close maintenance record?" subtitle={closeTarget?.reason}>
        <p className="text-dim text-[13px] mb-5">The vehicle will return to Available status (unless retired).</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setCloseTarget(null)}>Cancel</Button>
          <Button onClick={confirmClose} disabled={saving}>{saving ? 'Closing…' : 'Close Record'}</Button>
        </div>
      </Modal>
    </PageLayout>
  )
}
