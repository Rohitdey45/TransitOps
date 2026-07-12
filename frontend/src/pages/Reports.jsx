import React, { useEffect, useState } from 'react'
import { Download, FileText, TrendingUp, TrendingDown } from 'lucide-react'
import PageLayout from '../components/PageLayout.jsx'
import { Field, Input, Select } from '../components/Field.jsx'
import { Button, Loader, ErrorState } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import api from '../api/client.js'
import { downloadFile } from '../utils/download.js'
import { formatCurrency, formatNumber } from '../utils/format.js'

export default function Reports() {
  const { can } = useAuth()
  const toast = useToast()
  const [vehicles, setVehicles] = useState([])
  const [utilization, setUtilization] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [vehicleId, setVehicleId] = useState('')
  const [revenue, setRevenue] = useState('')
  const [report, setReport] = useState(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [exporting, setExporting] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([api.getVehicles(), api.getFleetUtilization()])
      .then(([v, u]) => { if (active) { setVehicles(v.data); setUtilization(u.data) } })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  const runReport = async () => {
    if (!vehicleId) return
    setReportLoading(true)
    setReport(null)
    try {
      const { data } = await api.getVehicleReport(vehicleId, revenue || undefined)
      setReport(data)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setReportLoading(false)
    }
  }

  const runExport = async (path, key) => {
    setExporting(key)
    try {
      await downloadFile(path)
      toast.success('Export downloaded')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setExporting('')
    }
  }

  return (
    <PageLayout title="Reports & Analytics" subtitle="Fuel efficiency, cost, utilization, and ROI across the fleet.">
      {error && <div className="mb-4"><ErrorState message={error} /></div>}
      {loading ? (
        <Loader label="Loading reports…" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="bg-panel border border-line rounded-lg px-5 py-4">
              <p className="label-eyebrow mb-2.5">Total Vehicles</p>
              <span className="font-display font-semibold text-[28px]">{utilization?.totalVehicles ?? 0}</span>
            </div>
            <div className="bg-panel border border-line rounded-lg px-5 py-4">
              <p className="label-eyebrow mb-2.5">Currently On Trip</p>
              <span className="font-display font-semibold text-[28px] text-info">{utilization?.onTrip ?? 0}</span>
            </div>
            <div className="bg-panel border border-line rounded-lg px-5 py-4">
              <p className="label-eyebrow mb-2.5">Fleet Utilization</p>
              <span className="font-display font-semibold text-[28px]">{((utilization?.fleetUtilization ?? 0) * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div className="bg-panel border border-line rounded-lg p-5 mb-6">
            <p className="label-eyebrow mb-4">Vehicle Report — Efficiency, Cost & ROI</p>
            <div className="flex items-end gap-3 flex-wrap mb-5">
              <div className="w-64">
                <Field label="Vehicle">
                  <Select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
                    <option value="">Select vehicle…</option>
                    {vehicles.map((v) => <option key={v.id} value={v.id}>{v.regNumber} — {v.name}</option>)}
                  </Select>
                </Field>
              </div>
              <div className="w-48">
                <Field label="Estimated Revenue" hint="Optional — for ROI calculation">
                  <Input type="number" step="any" value={revenue} onChange={(e) => setRevenue(e.target.value)} placeholder="0.00" />
                </Field>
              </div>
              <Button onClick={runReport} disabled={!vehicleId || reportLoading} className="mb-3.5">
                {reportLoading ? 'Calculating…' : 'Run Report'}
              </Button>
            </div>

            {report && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4 border-t border-line">
                <div>
                  <p className="label-eyebrow mb-1">Total Distance</p>
                  <p className="font-mono text-[14px]">{formatNumber(report.totalDistance)} km</p>
                </div>
                <div>
                  <p className="label-eyebrow mb-1">Fuel Used</p>
                  <p className="font-mono text-[14px]">{formatNumber(report.totalFuelLiters)} L</p>
                </div>
                <div>
                  <p className="label-eyebrow mb-1">Fuel Efficiency</p>
                  <p className="font-mono text-[14px]">{formatNumber(report.fuelEfficiency, 2)} km/L</p>
                </div>
                <div>
                  <p className="label-eyebrow mb-1">Operational Cost</p>
                  <p className="font-mono text-[14px]">{formatCurrency(report.operationalCost)}</p>
                </div>
                <div>
                  <p className="label-eyebrow mb-1">ROI</p>
                  <p className={`font-mono text-[14px] flex items-center gap-1 ${report.roi >= 0 ? 'text-ok' : 'text-err'}`}>
                    {report.roi >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    {(report.roi * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            )}
          </div>

          {can.exportReports && (
            <div className="bg-panel border border-line rounded-lg p-5">
              <p className="label-eyebrow mb-4">Export Reports</p>
              <div className="flex flex-wrap gap-2.5">
                <Button variant="secondary" onClick={() => runExport('/reports/export/vehicles.csv', 'csv')} disabled={exporting === 'csv'}>
                  <Download size={14} /> {exporting === 'csv' ? 'Exporting…' : 'Vehicle Registry (CSV)'}
                </Button>
                <Button variant="secondary" onClick={() => runExport('/reports/export/vehicles.pdf', 'pdf')} disabled={exporting === 'pdf'}>
                  <FileText size={14} /> {exporting === 'pdf' ? 'Exporting…' : 'Vehicle Registry (PDF)'}
                </Button>
                {vehicleId && (
                  <Button variant="secondary" onClick={() => runExport(`/reports/export/vehicle/${vehicleId}/summary.pdf`, 'summary')} disabled={exporting === 'summary'}>
                    <FileText size={14} /> {exporting === 'summary' ? 'Exporting…' : 'Selected Vehicle Summary (PDF)'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </PageLayout>
  )
}
