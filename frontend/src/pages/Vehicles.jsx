import React, { useEffect, useState } from 'react'
import { Plus, MoreVertical, Search, Trash2, Pencil, Gauge } from 'lucide-react'
import PageLayout from '../components/PageLayout.jsx'
import Modal from '../components/Modal.jsx'
import { Field, Input, Select } from '../components/Field.jsx'
import { Button, Loader, EmptyState, ErrorState } from '../components/ui.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import api from '../api/client.js'
import { formatCurrency, formatNumber, formatDate } from '../utils/format.js'

const STATUS_OPTIONS = ['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED']
const EMPTY_FORM = { regNumber: '', name: '', type: '', maxLoadCapacity: '', odometer: '', acquisitionCost: '', status: 'AVAILABLE' }

export default function Vehicles() {
  const { can } = useAuth()
  const toast = useToast()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [detail, setDetail] = useState(null)
  const [cost, setCost] = useState(null)
  const [costLoading, setCostLoading] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.getVehicles({ status: statusFilter || undefined })
      setVehicles(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [statusFilter])

  const filtered = vehicles.filter((v) =>
    !search || v.regNumber.toLowerCase().includes(search.toLowerCase()) || v.name.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormOpen(true)
  }

  const openEdit = (v) => {
    setEditing(v)
    setForm({
      regNumber: v.regNumber, name: v.name, type: v.type,
      maxLoadCapacity: v.maxLoadCapacity, odometer: v.odometer,
      acquisitionCost: v.acquisitionCost, status: v.status,
    })
    setFormOpen(true)
    setOpenMenu(null)
  }

  const openDetail = async (v) => {
    setDetail(v)
    setCost(null)
    setCostLoading(true)
    try {
      const { data } = await api.getVehicleOperationalCost(v.id)
      setCost(data)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setCostLoading(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        maxLoadCapacity: parseFloat(form.maxLoadCapacity),
        odometer: parseFloat(form.odometer),
        acquisitionCost: parseFloat(form.acquisitionCost),
      }
      if (editing) {
        await api.updateVehicle(editing.id, payload)
        toast.success('Vehicle updated')
      } else {
        delete payload.status
        await api.createVehicle(payload)
        toast.success('Vehicle registered')
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
      await api.deleteVehicle(deleteTarget.id)
      toast.success('Vehicle deleted')
      setDeleteTarget(null)
      load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <PageLayout
      title="Vehicle Registry"
      subtitle="Master list of fleet assets, capacity, and lifecycle status."
      actions={can.manageVehicles && <Button size="sm" onClick={openCreate}><Plus size={14} /> Add Vehicle</Button>}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="relative w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reg. number or name…"
            className="w-full bg-panel2 border border-line rounded-md pl-9 pr-3 py-2 text-[13px] font-mono placeholder:text-faint focus:border-line2 focus:outline-none"
          />
        </div>
        <div className="flex gap-1 bg-panel2 border border-line rounded-md p-1">
          {['', ...STATUS_OPTIONS].map((s) => (
            <button
              key={s || 'all'}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded text-[11.5px] font-mono transition-colors ${
                statusFilter === s ? 'bg-ink text-bg' : 'text-dim hover:text-ink'
              }`}
            >
              {s ? s.replace('_', ' ') : 'ALL'}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-4"><ErrorState message={error} /></div>}

      {loading ? (
        <Loader label="Loading vehicles…" />
      ) : filtered.length === 0 ? (
        <EmptyState title="No vehicles yet" hint="Register a vehicle to get started." />
      ) : (
        <div className="bg-panel border border-line rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line">
                {['Reg. Number', 'Name', 'Type', 'Max Load', 'Odometer', 'Acq. Cost', 'Status', ''].map((h) => (
                  <th key={h} className="label-eyebrow px-4 py-3 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-b border-line last:border-0 hover:bg-panel2/60 cursor-pointer transition-colors" onClick={() => openDetail(v)}>
                  <td className="px-4 py-3 font-mono text-[12.5px]">{v.regNumber}</td>
                  <td className="px-4 py-3 text-[13px]">{v.name}</td>
                  <td className="px-4 py-3 text-[13px] text-dim">{v.type}</td>
                  <td className="px-4 py-3 font-mono text-[12.5px] text-dim">{formatNumber(v.maxLoadCapacity)} kg</td>
                  <td className="px-4 py-3 font-mono text-[12.5px] text-dim">{formatNumber(v.odometer)} km</td>
                  <td className="px-4 py-3 font-mono text-[12.5px] text-dim">{formatCurrency(v.acquisitionCost)}</td>
                  <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                  <td className="px-4 py-3 relative" onClick={(e) => e.stopPropagation()}>
                    {can.manageVehicles && (
                      <>
                        <button onClick={() => setOpenMenu(openMenu === v.id ? null : v.id)} className="text-dim hover:text-ink p-1">
                          <MoreVertical size={15} />
                        </button>
                        {openMenu === v.id && (
                          <div className="absolute right-4 top-9 z-10 bg-panel3 border border-line2 rounded-md shadow-xl w-36 py-1">
                            <button onClick={() => openEdit(v)} className="w-full flex items-center gap-2 px-3 py-2 text-[12.5px] text-ink hover:bg-panel2">
                              <Pencil size={13} /> Edit
                            </button>
                            <button onClick={() => { setDeleteTarget(v); setOpenMenu(null) }} className="w-full flex items-center gap-2 px-3 py-2 text-[12.5px] text-err hover:bg-panel2">
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit Vehicle' : 'Register Vehicle'} subtitle={editing ? editing.regNumber : 'Add a new asset to the fleet registry'}>
        <form onSubmit={submit}>
          <Field label="Registration Number" required>
            <Input required disabled={!!editing} value={form.regNumber} onChange={(e) => setForm({ ...form, regNumber: e.target.value })} placeholder="XYZ-1234" />
          </Field>
          <Field label="Vehicle Name / Model" required>
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Heavy Truck A" />
          </Field>
          <Field label="Type" required>
            <Input required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Semi" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Max Load Capacity (kg)" required>
              <Input required type="number" step="any" value={form.maxLoadCapacity} onChange={(e) => setForm({ ...form, maxLoadCapacity: e.target.value })} />
            </Field>
            <Field label="Odometer (km)" required>
              <Input required type="number" step="any" value={form.odometer} onChange={(e) => setForm({ ...form, odometer: e.target.value })} />
            </Field>
          </div>
          <Field label="Acquisition Cost" required>
            <Input required type="number" step="any" value={form.acquisitionCost} onChange={(e) => setForm({ ...form, acquisitionCost: e.target.value })} />
          </Field>
          {editing && (
            <Field label="Status">
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </Select>
            </Field>
          )}
          <div className="flex justify-end gap-2 mt-5">
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Register Vehicle'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete vehicle?" subtitle={deleteTarget?.regNumber}>
        <p className="text-dim text-[13px] mb-5">This will permanently remove {deleteTarget?.name} from the registry. This action can't be undone.</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete Vehicle</Button>
        </div>
      </Modal>

      {/* Detail / operational cost */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.name} subtitle={detail?.regNumber}>
        {detail && (
          <div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-panel2 border border-line rounded-md p-3">
                <p className="label-eyebrow mb-1">Type</p>
                <p className="text-[13px]">{detail.type}</p>
              </div>
              <div className="bg-panel2 border border-line rounded-md p-3">
                <p className="label-eyebrow mb-1">Status</p>
                <StatusBadge status={detail.status} />
              </div>
              <div className="bg-panel2 border border-line rounded-md p-3">
                <p className="label-eyebrow mb-1">Max Load</p>
                <p className="text-[13px] font-mono">{formatNumber(detail.maxLoadCapacity)} kg</p>
              </div>
              <div className="bg-panel2 border border-line rounded-md p-3">
                <p className="label-eyebrow mb-1">Odometer</p>
                <p className="text-[13px] font-mono">{formatNumber(detail.odometer)} km</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Gauge size={14} className="text-dim" />
              <p className="label-eyebrow">Operational Cost Summary</p>
            </div>
            {costLoading ? (
              <Loader label="Calculating…" />
            ) : cost ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-panel2 border border-line rounded-md p-3">
                  <p className="label-eyebrow mb-1">Fuel Cost</p>
                  <p className="text-[15px] font-mono font-medium">{formatCurrency(cost.totalFuelCost)}</p>
                </div>
                <div className="bg-panel2 border border-line rounded-md p-3">
                  <p className="label-eyebrow mb-1">Expense Cost</p>
                  <p className="text-[15px] font-mono font-medium">{formatCurrency(cost.totalExpenseCost)}</p>
                </div>
                <div className="bg-panel2 border border-line rounded-md p-3">
                  <p className="label-eyebrow mb-1">Maintenance Cost</p>
                  <p className="text-[15px] font-mono font-medium">{formatCurrency(cost.totalMaintenanceCost)}</p>
                </div>
                <div className="bg-ink/5 border border-line2 rounded-md p-3">
                  <p className="label-eyebrow mb-1">Total Operational Cost</p>
                  <p className="text-[15px] font-mono font-semibold">{formatCurrency(cost.totalOperationalCost)}</p>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </Modal>
    </PageLayout>
  )
}
