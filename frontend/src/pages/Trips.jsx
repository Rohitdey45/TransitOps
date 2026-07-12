import React, { useEffect, useState } from 'react'
import { Plus, ArrowRight, Ban, Repeat, Flag } from 'lucide-react'
import PageLayout from '../components/PageLayout.jsx'
import Modal from '../components/Modal.jsx'
import { Field, Input, Select, Textarea } from '../components/Field.jsx'
import { Button, Loader, EmptyState, ErrorState } from '../components/ui.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import api from '../api/client.js'
import { formatNumber, formatDateTime } from '../utils/format.js'

const STATUS_OPTIONS = ['DRAFT', 'DISPATCHED', 'COMPLETED', 'CANCELLED']
const EMPTY_CREATE = { source: '', destination: '', vehicleId: '', driverId: '', cargoWeight: '', plannedDistance: '' }
const EMPTY_DISPATCH = { estimatedFuelLevelStart: '', odometerStart: '', vehicleCondition: 'GOOD', maintenanceNote: '' }
const EMPTY_COMPLETE = { odometerEnd: '', finalFuelLevel: '', fuelBillAmount: '' }

const STAGES = ['DRAFT', 'DISPATCHED', 'COMPLETED']

export default function Trips() {
  const { can } = useAuth()
  const toast = useToast()
  const [trips, setTrips] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState(EMPTY_CREATE)
  const [saving, setSaving] = useState(false)

  const [active, setActive] = useState(null) // trip selected for lifecycle actions
  const [actionMode, setActionMode] = useState(null) // 'dispatch' | 'reassign' | 'complete' | 'cancel'
  const [dispatchForm, setDispatchForm] = useState(EMPTY_DISPATCH)
  const [completeForm, setCompleteForm] = useState(EMPTY_COMPLETE)
  const [reassignForm, setReassignForm] = useState({ vehicleId: '', driverId: '' })

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [t, v, d] = await Promise.all([
        api.getTrips({ status: statusFilter || undefined }),
        api.getVehicles({ status: 'AVAILABLE' }),
        api.getDrivers({ status: 'AVAILABLE' }),
      ])
      setTrips(t.data)
      setVehicles(v.data)
      setDrivers(d.data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [statusFilter])

  const vehicleLabel = (id) => vehicles.find((v) => v.id === id)?.regNumber || id?.slice(0, 8) || '—'
  const driverLabel = (id) => drivers.find((d) => d.id === id)?.name || id?.slice(0, 8) || '—'

  const openAction = (trip, mode) => {
    setActive(trip)
    setActionMode(mode)
    if (mode === 'dispatch') setDispatchForm(EMPTY_DISPATCH)
    if (mode === 'complete') setCompleteForm(EMPTY_COMPLETE)
    if (mode === 'reassign') setReassignForm({ vehicleId: '', driverId: '' })
  }

  const closeAction = () => { setActive(null); setActionMode(null) }

  const createTrip = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.createTrip({
        ...createForm,
        cargoWeight: parseFloat(createForm.cargoWeight),
        plannedDistance: parseFloat(createForm.plannedDistance),
      })
      toast.success('Trip created as Draft')
      setCreateOpen(false)
      setCreateForm(EMPTY_CREATE)
      load()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const runDispatch = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.dispatchTrip(active.id, {
        estimatedFuelLevelStart: parseFloat(dispatchForm.estimatedFuelLevelStart),
        odometerStart: parseFloat(dispatchForm.odometerStart),
        vehicleCondition: dispatchForm.vehicleCondition,
        maintenanceNote: dispatchForm.maintenanceNote,
      })
      toast.success('Trip dispatched')
      closeAction()
      load()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const runReassign = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body = {}
      if (reassignForm.vehicleId) body.vehicleId = reassignForm.vehicleId
      if (reassignForm.driverId) body.driverId = reassignForm.driverId
      await api.reassignTrip(active.id, body)
      toast.success('Trip reassigned')
      closeAction()
      load()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const runComplete = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.completeTrip(active.id, {
        odometerEnd: parseFloat(completeForm.odometerEnd),
        finalFuelLevel: parseFloat(completeForm.finalFuelLevel),
        fuelBillAmount: parseFloat(completeForm.fuelBillAmount),
      })
      toast.success('Trip completed')
      closeAction()
      load()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const runCancel = async () => {
    setSaving(true)
    try {
      await api.cancelTrip(active.id)
      toast.success('Trip cancelled')
      closeAction()
      load()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageLayout
      title="Trip Management"
      subtitle="Dispatch, track, and close out fleet trips end to end."
      actions={can.manageTrips && <Button size="sm" onClick={() => setCreateOpen(true)}><Plus size={14} /> Create Trip</Button>}
    >
      <div className="flex gap-1 bg-panel2 border border-line rounded-md p-1 mb-5 w-fit">
        {['', ...STATUS_OPTIONS].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded text-[11.5px] font-mono transition-colors ${statusFilter === s ? 'bg-ink text-bg' : 'text-dim hover:text-ink'}`}
          >
            {s || 'ALL'}
          </button>
        ))}
      </div>

      {error && <div className="mb-4"><ErrorState message={error} /></div>}

      {loading ? (
        <Loader label="Loading trips…" />
      ) : trips.length === 0 ? (
        <EmptyState title="No trips yet" hint="Create a trip to start dispatching your fleet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {trips.map((t) => (
            <div key={t.id} className="bg-panel border border-line rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-faint">#{t.id.slice(0, 8)}</span>
                <StatusBadge status={t.status} />
              </div>
              <div className="flex items-center gap-2 text-[13.5px]">
                <span className="truncate">{t.source}</span>
                <ArrowRight size={12} className="text-faint shrink-0" />
                <span className="truncate">{t.destination}</span>
              </div>
              <div className="flex items-center gap-1.5 h-1">
                {STAGES.map((s, i) => (
                  <div
                    key={s}
                    className={`flex-1 rounded-full h-full ${
                      t.status === 'CANCELLED' ? 'bg-err/40' :
                      STAGES.indexOf(t.status) >= i ? 'bg-ink' : 'bg-line'
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-y-1.5 text-[12px]">
                <span className="text-faint">Vehicle</span>
                <span className="font-mono text-right">{vehicleLabel(t.vehicleId)}</span>
                <span className="text-faint">Driver</span>
                <span className="text-right truncate">{driverLabel(t.driverId)}</span>
                <span className="text-faint">Cargo</span>
                <span className="font-mono text-right">{formatNumber(t.cargoWeight)} kg</span>
                <span className="text-faint">Distance</span>
                <span className="font-mono text-right">{formatNumber(t.plannedDistance)} km</span>
              </div>

              {can.manageTrips && (
                <div className="flex gap-1.5 pt-2 border-t border-line mt-1">
                  {t.status === 'DRAFT' && (
                    <>
                      <Button size="sm" className="flex-1" onClick={() => openAction(t, 'dispatch')}>Dispatch</Button>
                      <Button size="sm" variant="secondary" onClick={() => openAction(t, 'reassign')}><Repeat size={13} /></Button>
                    </>
                  )}
                  {t.status === 'DISPATCHED' && (
                    <>
                      <Button size="sm" className="flex-1" onClick={() => openAction(t, 'complete')}><Flag size={13} /> Complete</Button>
                      <Button size="sm" variant="secondary" onClick={() => openAction(t, 'reassign')}><Repeat size={13} /></Button>
                      <Button size="sm" variant="danger" onClick={() => openAction(t, 'cancel')}><Ban size={13} /></Button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create trip */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Trip" subtitle="New trips start in Draft status">
        <form onSubmit={createTrip}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Source" required><Input required value={createForm.source} onChange={(e) => setCreateForm({ ...createForm, source: e.target.value })} placeholder="Warehouse A" /></Field>
            <Field label="Destination" required><Input required value={createForm.destination} onChange={(e) => setCreateForm({ ...createForm, destination: e.target.value })} placeholder="Warehouse B" /></Field>
          </div>
          <Field label="Vehicle" required>
            <Select required value={createForm.vehicleId} onChange={(e) => setCreateForm({ ...createForm, vehicleId: e.target.value })}>
              <option value="">Select available vehicle…</option>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.regNumber} — {v.name} (max {formatNumber(v.maxLoadCapacity)}kg)</option>)}
            </Select>
          </Field>
          <Field label="Driver" required>
            <Select required value={createForm.driverId} onChange={(e) => setCreateForm({ ...createForm, driverId: e.target.value })}>
              <option value="">Select available driver…</option>
              {drivers.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.licenseNumber}</option>)}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cargo Weight (kg)" required><Input required type="number" step="any" value={createForm.cargoWeight} onChange={(e) => setCreateForm({ ...createForm, cargoWeight: e.target.value })} /></Field>
            <Field label="Planned Distance (km)" required><Input required type="number" step="any" value={createForm.plannedDistance} onChange={(e) => setCreateForm({ ...createForm, plannedDistance: e.target.value })} /></Field>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create Trip'}</Button>
          </div>
        </form>
      </Modal>

      {/* Dispatch */}
      <Modal open={actionMode === 'dispatch'} onClose={closeAction} title="Dispatch Trip" subtitle={active ? `${active.source} → ${active.destination}` : ''}>
        <form onSubmit={runDispatch}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Odometer Start (km)" required><Input required type="number" step="any" value={dispatchForm.odometerStart} onChange={(e) => setDispatchForm({ ...dispatchForm, odometerStart: e.target.value })} /></Field>
            <Field label="Est. Fuel Level Start (%)" required><Input required type="number" step="any" value={dispatchForm.estimatedFuelLevelStart} onChange={(e) => setDispatchForm({ ...dispatchForm, estimatedFuelLevelStart: e.target.value })} /></Field>
          </div>
          <Field label="Vehicle Condition">
            <Select value={dispatchForm.vehicleCondition} onChange={(e) => setDispatchForm({ ...dispatchForm, vehicleCondition: e.target.value })}>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="POOR">Poor</option>
            </Select>
          </Field>
          <Field label="Maintenance Note">
            <Textarea value={dispatchForm.maintenanceNote} onChange={(e) => setDispatchForm({ ...dispatchForm, maintenanceNote: e.target.value })} placeholder="Check tire pressure" />
          </Field>
          <div className="flex justify-end gap-2 mt-5">
            <Button type="button" variant="secondary" onClick={closeAction}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Dispatching…' : 'Dispatch Trip'}</Button>
          </div>
        </form>
      </Modal>

      {/* Reassign */}
      <Modal open={actionMode === 'reassign'} onClose={closeAction} title="Reassign Trip" subtitle={active ? `${active.source} → ${active.destination}` : ''}>
        <form onSubmit={runReassign}>
          <p className="text-faint text-[12px] mb-4">Leave a field blank to keep the current assignment.</p>
          <Field label="New Vehicle">
            <Select value={reassignForm.vehicleId} onChange={(e) => setReassignForm({ ...reassignForm, vehicleId: e.target.value })}>
              <option value="">Keep current vehicle</option>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.regNumber} — {v.name}</option>)}
            </Select>
          </Field>
          <Field label="New Driver">
            <Select value={reassignForm.driverId} onChange={(e) => setReassignForm({ ...reassignForm, driverId: e.target.value })}>
              <option value="">Keep current driver</option>
              {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
          </Field>
          <div className="flex justify-end gap-2 mt-5">
            <Button type="button" variant="secondary" onClick={closeAction}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Reassigning…' : 'Reassign Trip'}</Button>
          </div>
        </form>
      </Modal>

      {/* Complete */}
      <Modal open={actionMode === 'complete'} onClose={closeAction} title="Complete Trip" subtitle={active ? `${active.source} → ${active.destination}` : ''}>
        <form onSubmit={runComplete}>
          <Field label="Odometer End (km)" required><Input required type="number" step="any" value={completeForm.odometerEnd} onChange={(e) => setCompleteForm({ ...completeForm, odometerEnd: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Final Fuel Level (%)" required><Input required type="number" step="any" value={completeForm.finalFuelLevel} onChange={(e) => setCompleteForm({ ...completeForm, finalFuelLevel: e.target.value })} /></Field>
            <Field label="Fuel Bill Amount" required><Input required type="number" step="any" value={completeForm.fuelBillAmount} onChange={(e) => setCompleteForm({ ...completeForm, fuelBillAmount: e.target.value })} /></Field>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <Button type="button" variant="secondary" onClick={closeAction}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Completing…' : 'Complete Trip'}</Button>
          </div>
        </form>
      </Modal>

      {/* Cancel confirm */}
      <Modal open={actionMode === 'cancel'} onClose={closeAction} title="Cancel trip?" subtitle={active ? `${active.source} → ${active.destination}` : ''}>
        <p className="text-dim text-[13px] mb-5">This releases the assigned vehicle and driver back to Available.</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={closeAction}>Keep Trip</Button>
          <Button variant="danger" onClick={runCancel} disabled={saving}>{saving ? 'Cancelling…' : 'Cancel Trip'}</Button>
        </div>
      </Modal>
    </PageLayout>
  )
}
