import React, { useEffect, useState } from 'react'
import { Plus, Fuel as FuelIcon, Receipt } from 'lucide-react'
import PageLayout from '../components/PageLayout.jsx'
import Modal from '../components/Modal.jsx'
import { Field, Input, Select } from '../components/Field.jsx'
import { Button, Loader, EmptyState, ErrorState } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import api from '../api/client.js'
import { formatCurrency, formatDateTime, formatNumber } from '../utils/format.js'

const EXPENSE_TYPES = ['TOLL', 'FINE', 'PARKING', 'OTHER']
const EMPTY_FUEL = { vehicleId: '', tripId: '', liters: '', cost: '' }
const EMPTY_EXPENSE = { vehicleId: '', type: 'TOLL', amount: '', description: '' }

export default function FuelExpenses() {
  const { can } = useAuth()
  const toast = useToast()
  const [tab, setTab] = useState('fuel')
  const [vehicles, setVehicles] = useState([])
  const [fuelLogs, setFuelLogs] = useState([])
  const [expenses, setExpenses] = useState([])
  const [vehicleFilter, setVehicleFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [fuelFormOpen, setFuelFormOpen] = useState(false)
  const [fuelForm, setFuelForm] = useState(EMPTY_FUEL)
  const [expenseFormOpen, setExpenseFormOpen] = useState(false)
  const [expenseForm, setExpenseForm] = useState(EMPTY_EXPENSE)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [v, f, ex] = await Promise.all([
        api.getVehicles(),
        api.getFuelLogs({ vehicleId: vehicleFilter || undefined }),
        api.getExpenses({ vehicleId: vehicleFilter || undefined, type: typeFilter || undefined }),
      ])
      setVehicles(v.data)
      setFuelLogs(f.data)
      setExpenses(ex.data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [vehicleFilter, typeFilter])

  const vehicleLabel = (id) => {
    const v = vehicles.find((v) => v.id === id)
    return v ? `${v.regNumber} — ${v.name}` : id?.slice(0, 8)
  }

  const submitFuel = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.createFuelLog({
        vehicleId: fuelForm.vehicleId,
        tripId: fuelForm.tripId || null,
        liters: parseFloat(fuelForm.liters),
        cost: parseFloat(fuelForm.cost),
      })
      toast.success('Fuel log recorded')
      setFuelFormOpen(false)
      setFuelForm(EMPTY_FUEL)
      load()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const submitExpense = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.createExpense({ ...expenseForm, amount: parseFloat(expenseForm.amount) })
      toast.success('Expense recorded')
      setExpenseFormOpen(false)
      setExpenseForm(EMPTY_EXPENSE)
      load()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageLayout
      title="Fuel & Expenses"
      subtitle="Fuel purchases, tolls, fines, and other operational spend."
      actions={
        tab === 'fuel'
          ? can.logFuel && <Button size="sm" onClick={() => setFuelFormOpen(true)}><Plus size={14} /> Log Fuel</Button>
          : can.logExpenses && <Button size="sm" onClick={() => setExpenseFormOpen(true)}><Plus size={14} /> Log Expense</Button>
      }
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex gap-1 bg-panel2 border border-line rounded-md p-1">
          <button onClick={() => setTab('fuel')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] transition-colors ${tab === 'fuel' ? 'bg-ink text-bg' : 'text-dim hover:text-ink'}`}>
            <FuelIcon size={13} /> Fuel Logs
          </button>
          <button onClick={() => setTab('expenses')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] transition-colors ${tab === 'expenses' ? 'bg-ink text-bg' : 'text-dim hover:text-ink'}`}>
            <Receipt size={13} /> Expenses
          </button>
        </div>
        <Select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} className="w-52">
          <option value="">All Vehicles</option>
          {vehicles.map((v) => <option key={v.id} value={v.id}>{v.regNumber} — {v.name}</option>)}
        </Select>
        {tab === 'expenses' && (
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-40">
            <option value="">All Types</option>
            {EXPENSE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        )}
      </div>

      {error && <div className="mb-4"><ErrorState message={error} /></div>}

      {loading ? (
        <Loader label="Loading logs…" />
      ) : tab === 'fuel' ? (
        fuelLogs.length === 0 ? (
          <EmptyState title="No fuel logs yet" hint="Log a fuel purchase to start tracking consumption." />
        ) : (
          <div className="bg-panel border border-line rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b border-line">{['Vehicle', 'Liters', 'Cost', 'Date'].map((h) => <th key={h} className="label-eyebrow px-4 py-3 font-normal">{h}</th>)}</tr></thead>
              <tbody>
                {fuelLogs.map((f) => (
                  <tr key={f.id} className="border-b border-line last:border-0 hover:bg-panel2/60 transition-colors">
                    <td className="px-4 py-3 text-[13px]">{vehicleLabel(f.vehicleId)}</td>
                    <td className="px-4 py-3 font-mono text-[12.5px] text-dim">{formatNumber(f.liters, 1)} L</td>
                    <td className="px-4 py-3 font-mono text-[12.5px]">{formatCurrency(f.cost)}</td>
                    <td className="px-4 py-3 font-mono text-[11.5px] text-dim">{formatDateTime(f.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : expenses.length === 0 ? (
        <EmptyState title="No expenses yet" hint="Log a toll, fine, or parking expense." />
      ) : (
        <div className="bg-panel border border-line rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead><tr className="border-b border-line">{['Vehicle', 'Type', 'Description', 'Amount', 'Date'].map((h) => <th key={h} className="label-eyebrow px-4 py-3 font-normal">{h}</th>)}</tr></thead>
            <tbody>
              {expenses.map((ex) => (
                <tr key={ex.id} className="border-b border-line last:border-0 hover:bg-panel2/60 transition-colors">
                  <td className="px-4 py-3 text-[13px]">{vehicleLabel(ex.vehicleId)}</td>
                  <td className="px-4 py-3"><span className="font-mono text-[10.5px] uppercase tracking-wide px-2 py-0.5 rounded border border-line2 text-dim">{ex.type}</span></td>
                  <td className="px-4 py-3 text-[13px] text-dim">{ex.description || '—'}</td>
                  <td className="px-4 py-3 font-mono text-[12.5px]">{formatCurrency(ex.amount)}</td>
                  <td className="px-4 py-3 font-mono text-[11.5px] text-dim">{formatDateTime(ex.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={fuelFormOpen} onClose={() => setFuelFormOpen(false)} title="Log Fuel Purchase">
        <form onSubmit={submitFuel}>
          <Field label="Vehicle" required>
            <Select required value={fuelForm.vehicleId} onChange={(e) => setFuelForm({ ...fuelForm, vehicleId: e.target.value })}>
              <option value="">Select vehicle…</option>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.regNumber} — {v.name}</option>)}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Liters" required><Input required type="number" step="any" value={fuelForm.liters} onChange={(e) => setFuelForm({ ...fuelForm, liters: e.target.value })} /></Field>
            <Field label="Cost" required><Input required type="number" step="any" value={fuelForm.cost} onChange={(e) => setFuelForm({ ...fuelForm, cost: e.target.value })} /></Field>
          </div>
          <Field label="Trip ID" hint="Optional — link this purchase to a specific trip">
            <Input value={fuelForm.tripId} onChange={(e) => setFuelForm({ ...fuelForm, tripId: e.target.value })} placeholder="Optional trip UUID" />
          </Field>
          <div className="flex justify-end gap-2 mt-5">
            <Button type="button" variant="secondary" onClick={() => setFuelFormOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Log Fuel'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={expenseFormOpen} onClose={() => setExpenseFormOpen(false)} title="Log Expense">
        <form onSubmit={submitExpense}>
          <Field label="Vehicle" required>
            <Select required value={expenseForm.vehicleId} onChange={(e) => setExpenseForm({ ...expenseForm, vehicleId: e.target.value })}>
              <option value="">Select vehicle…</option>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.regNumber} — {v.name}</option>)}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type" required>
              <Select required value={expenseForm.type} onChange={(e) => setExpenseForm({ ...expenseForm, type: e.target.value })}>
                {EXPENSE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Amount" required><Input required type="number" step="any" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} /></Field>
          </div>
          <Field label="Description">
            <Input value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} placeholder="Highway toll" />
          </Field>
          <div className="flex justify-end gap-2 mt-5">
            <Button type="button" variant="secondary" onClick={() => setExpenseFormOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Log Expense'}</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  )
}
