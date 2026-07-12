import React, { useEffect, useState } from 'react'
import { Plus, MoreVertical, Search, Trash2, Pencil, AlertCircle } from 'lucide-react'
import PageLayout from '../components/PageLayout.jsx'
import Modal from '../components/Modal.jsx'
import { Field, Input, Select } from '../components/Field.jsx'
import { Button, Loader, EmptyState, ErrorState } from '../components/ui.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import api from '../api/client.js'
import { formatDate, daysUntil, initials } from '../utils/format.js'

const STATUS_OPTIONS = ['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED']
const EMPTY_FORM = { name: '', licenseNumber: '', licenseCategory: '', licenseExpiry: '', contactNumber: '' }

export default function Drivers() {
  const { can } = useAuth()
  const toast = useToast()
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [limitedForm, setLimitedForm] = useState({ status: '', safetyScore: '' })
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)

  const canEditFull = can.manageDriversFull
  const canEditLimited = can.manageDriversLimited
  const canEditAny = canEditFull || canEditLimited

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.getDrivers({ status: statusFilter || undefined })
      setDrivers(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [statusFilter])

  const filtered = drivers.filter((d) =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.licenseNumber.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormOpen(true)
  }

  const openEdit = (d) => {
    setEditing(d)
    if (canEditFull) {
      setForm({
        name: d.name, licenseNumber: d.licenseNumber, licenseCategory: d.licenseCategory,
        licenseExpiry: d.licenseExpiry?.slice(0, 10) || '', contactNumber: d.contactNumber,
      })
    } else {
      setLimitedForm({ status: d.status, safetyScore: d.safetyScore })
    }
    setFormOpen(true)
    setOpenMenu(null)
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const payload = canEditFull ? form : { status: limitedForm.status, safetyScore: parseInt(limitedForm.safetyScore, 10) }
        await api.updateDriver(editing.id, payload)
        toast.success('Driver updated')
      } else {
        await api.createDriver(form)
        toast.success('Driver registered')
      }
      setFormOpen(false)
      load()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    try {
      await api.deleteDriver(deleteTarget.id)
      toast.success('Driver deleted')
      setDeleteTarget(null)
      load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const expiryTone = (days) => {
    if (days === null) return 'text-dim'
    if (days < 0) return 'text-err'
    if (days <= 30) return 'text-warn'
    return 'text-dim'
  }

  return (
    <PageLayout
      title="Driver Management"
      subtitle="Driver profiles, license compliance, and safety scoring."
      actions={canEditFull && <Button size="sm" onClick={openCreate}><Plus size={14} /> Add Driver</Button>}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="relative w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or license…"
            className="w-full bg-panel2 border border-line rounded-md pl-9 pr-3 py-2 text-[13px] font-mono placeholder:text-faint focus:border-line2 focus:outline-none"
          />
        </div>
        <div className="flex gap-1 bg-panel2 border border-line rounded-md p-1">
          {['', ...STATUS_OPTIONS].map((s) => (
            <button
              key={s || 'all'}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded text-[11.5px] font-mono transition-colors ${statusFilter === s ? 'bg-ink text-bg' : 'text-dim hover:text-ink'}`}
            >
              {s ? s.replace('_', ' ') : 'ALL'}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-4"><ErrorState message={error} /></div>}

      {loading ? (
        <Loader label="Loading drivers…" />
      ) : filtered.length === 0 ? (
        <EmptyState title="No drivers yet" hint="Register a driver to get started." />
      ) : (
        <div className="bg-panel border border-line rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line">
                {['Driver', 'License', 'Category', 'Expiry', 'Safety Score', 'Status', ''].map((h) => (
                  <th key={h} className="label-eyebrow px-4 py-3 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => {
                const days = daysUntil(d.licenseExpiry)
                return (
                  <tr key={d.id} className="border-b border-line last:border-0 hover:bg-panel2/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-panel3 border border-line flex items-center justify-center text-[10.5px] font-mono shrink-0">
                          {initials(d.name)}
                        </div>
                        <div>
                          <p className="text-[13px]">{d.name}</p>
                          <p className="text-faint text-[11px]">{d.contactNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[12.5px] text-dim">{d.licenseNumber}</td>
                    <td className="px-4 py-3 text-[13px] text-dim">{d.licenseCategory}</td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1.5 font-mono text-[12px] ${expiryTone(days)}`}>
                        {days !== null && days <= 30 && <AlertCircle size={12} />}
                        {formatDate(d.licenseExpiry)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 w-24">
                        <div className="flex-1 h-1.5 bg-panel2 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${d.safetyScore >= 90 ? 'bg-ok' : d.safetyScore >= 70 ? 'bg-warn' : 'bg-err'}`} style={{ width: `${d.safetyScore}%` }} />
                        </div>
                        <span className="font-mono text-[11.5px] text-dim w-6">{d.safetyScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                    <td className="px-4 py-3 relative">
                      {canEditAny && (
                        <>
                          <button onClick={() => setOpenMenu(openMenu === d.id ? null : d.id)} className="text-dim hover:text-ink p-1">
                            <MoreVertical size={15} />
                          </button>
                          {openMenu === d.id && (
                            <div className="absolute right-4 top-9 z-10 bg-panel3 border border-line2 rounded-md shadow-xl w-36 py-1">
                              <button onClick={() => openEdit(d)} className="w-full flex items-center gap-2 px-3 py-2 text-[12.5px] text-ink hover:bg-panel2">
                                <Pencil size={13} /> Edit
                              </button>
                              {canEditFull && (
                                <button onClick={() => { setDeleteTarget(d); setOpenMenu(null) }} className="w-full flex items-center gap-2 px-3 py-2 text-[12.5px] text-err hover:bg-panel2">
                                  <Trash2 size={13} /> Delete
                                </button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit Driver' : 'Register Driver'} subtitle={editing ? editing.name : 'Add a new driver profile'}>
        {editing && !canEditFull ? (
          <form onSubmit={submit}>
            <p className="text-faint text-[12px] mb-4">As a Safety Officer, you can update status and safety score only.</p>
            <Field label="Status">
              <Select value={limitedForm.status} onChange={(e) => setLimitedForm({ ...limitedForm, status: e.target.value })}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </Select>
            </Field>
            <Field label="Safety Score (0–100)">
              <Input type="number" min="0" max="100" value={limitedForm.safetyScore} onChange={(e) => setLimitedForm({ ...limitedForm, safetyScore: e.target.value })} />
            </Field>
            <div className="flex justify-end gap-2 mt-5">
              <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
            </div>
          </form>
        ) : (
          <form onSubmit={submit}>
            <Field label="Full Name" required>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="License Number" required>
                <Input required disabled={!!editing} value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} placeholder="LIC-98765" />
              </Field>
              <Field label="License Category" required>
                <Input required value={form.licenseCategory} onChange={(e) => setForm({ ...form, licenseCategory: e.target.value })} placeholder="Class A" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="License Expiry" required>
                <Input required type="date" value={form.licenseExpiry} onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })} />
              </Field>
              <Field label="Contact Number" required>
                <Input required value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} placeholder="555-0199" />
              </Field>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Register Driver'}</Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete driver?" subtitle={deleteTarget?.licenseNumber}>
        <p className="text-dim text-[13px] mb-5">This will permanently remove {deleteTarget?.name} from the roster. This action can't be undone.</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete Driver</Button>
        </div>
      </Modal>
    </PageLayout>
  )
}
