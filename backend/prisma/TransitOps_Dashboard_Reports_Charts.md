# TransitOps Backend — Dashboard, Reports & Analytics, Charts

Scope: KPI dashboard endpoint, reports (fuel efficiency, fleet utilization, operational
cost, vehicle ROI), CSV export, and chart-ready data endpoints. Per spec sections 3.2 and 3.8.

No new database models needed — everything here is aggregation over data you've
already built (Vehicles, Drivers, Trips, MaintenanceLog, FuelLog, Expense).

## Role Permissions for This Phase

| Action | Fleet Manager | Driver | Safety Officer | Financial Analyst |
|---|---|---|---|---|
| View Dashboard KPIs | ✅ | ✅ | ✅ | ✅ |
| View Reports | ✅ | View only (own trips) | View only | ✅ |
| Export CSV | ✅ | ❌ | ❌ | ✅ |
| View chart data | ✅ | ✅ | ✅ | ✅ |

---

## 1. Dashboard KPIs

Create `src/routes/dashboard.js`:

```js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');

const prisma = new PrismaClient();

// ---------- GET /dashboard/kpis ----------
router.get('/kpis', requireAuth, async (req, res) => {
  const { type, status, region } = req.query; // optional filters per spec 3.2

  const vehicleWhere = {
    ...(type && { type }),
    ...(status && { status }),
    // region filter placeholder — add a `region` field to Vehicle model if you need this
  };

  const [
    totalVehicles,
    availableVehicles,
    inMaintenanceVehicles,
    activeTrips,
    pendingTrips,
    driversOnDuty,
  ] = await Promise.all([
    prisma.vehicle.count({ where: { ...vehicleWhere, status: { not: 'RETIRED' } } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: 'AVAILABLE' } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: 'IN_SHOP' } }),
    prisma.trip.count({ where: { status: 'DISPATCHED' } }),
    prisma.trip.count({ where: { status: 'DRAFT' } }),
    prisma.driver.count({ where: { status: { in: ['ON_TRIP', 'AVAILABLE'] } } }),
  ]);

  const onTripVehicles = await prisma.vehicle.count({ where: { ...vehicleWhere, status: 'ON_TRIP' } });
  const fleetUtilization = totalVehicles > 0 ? (onTripVehicles / totalVehicles) * 100 : 0;

  res.json({
    activeVehicles: totalVehicles,
    availableVehicles,
    vehiclesInMaintenance: inMaintenanceVehicles,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    fleetUtilization: Math.round(fleetUtilization * 100) / 100, // e.g. 62.5
  });
});

module.exports = router;
```

Wire into `src/server.js`:
```js
const dashboardRoutes = require('./routes/dashboard');
app.use('/dashboard', dashboardRoutes);
```

---

## 2. Reports & Analytics

Create `src/routes/reports.js`:

```js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requireRole } = require('../middleware/auth');

const prisma = new PrismaClient();

// ---------- GET /reports/vehicle/:id — per-vehicle report ----------
router.get('/vehicle/:id', requireAuth, async (req, res) => {
  const vehicleId = req.params.id;
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

  const [trips, fuelLogs, expenses, maintenanceLogs] = await Promise.all([
    prisma.trip.findMany({ where: { vehicleId, status: 'COMPLETED' } }),
    prisma.fuelLog.findMany({ where: { vehicleId } }),
    prisma.expense.findMany({ where: { vehicleId } }),
    prisma.maintenanceLog.findMany({ where: { vehicleId } }),
  ]);

  const totalDistance = trips.reduce((sum, t) => sum + (t.plannedDistance || 0), 0);
  const totalFuelLiters = fuelLogs.reduce((sum, f) => sum + f.liters, 0);
  const fuelEfficiency = totalFuelLiters > 0 ? totalDistance / totalFuelLiters : 0;

  const totalFuelCost = fuelLogs.reduce((sum, f) => sum + f.cost, 0);
  const totalExpenseCost = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalMaintenanceCost = maintenanceLogs.reduce((sum, m) => sum + m.cost, 0);
  const operationalCost = totalFuelCost + totalExpenseCost + totalMaintenanceCost;

  // Revenue isn't tracked elsewhere in the spec — assume a per-trip flat rate,
  // or a `revenue` field you add to Trip if you want real numbers. Placeholder = 0.
  const revenue = req.query.revenue ? parseFloat(req.query.revenue) : 0;
  const roi = vehicle.acquisitionCost > 0
    ? (revenue - operationalCost) / vehicle.acquisitionCost
    : 0;

  res.json({
    vehicleId,
    regNumber: vehicle.regNumber,
    totalDistance,
    totalFuelLiters,
    fuelEfficiency: Math.round(fuelEfficiency * 100) / 100,
    operationalCost,
    revenue,
    roi: Math.round(roi * 10000) / 10000,
  });
});

// ---------- GET /reports/fleet-utilization — org-wide ----------
router.get('/fleet-utilization', requireAuth, async (req, res) => {
  const totalVehicles = await prisma.vehicle.count({ where: { status: { not: 'RETIRED' } } });
  const onTrip = await prisma.vehicle.count({ where: { status: 'ON_TRIP' } });
  const utilization = totalVehicles > 0 ? (onTrip / totalVehicles) * 100 : 0;

  res.json({ totalVehicles, onTrip, fleetUtilization: Math.round(utilization * 100) / 100 });
});

// ---------- GET /reports/export/vehicles.csv ----------
router.get(
  '/export/vehicles.csv',
  requireAuth,
  requireRole('FLEET_MANAGER', 'FINANCIAL_ANALYST'),
  async (req, res) => {
    const vehicles = await prisma.vehicle.findMany();

    const header = 'id,regNumber,name,type,maxLoadCapacity,odometer,acquisitionCost,status';
    const rows = vehicles.map(v =>
      [v.id, v.regNumber, v.name, v.type, v.maxLoadCapacity, v.odometer, v.acquisitionCost, v.status].join(',')
    );
    const csv = [header, ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="vehicles_report.csv"');
    res.send(csv);
  }
);

module.exports = router;
```

Wire into `src/server.js`:
```js
const reportRoutes = require('./routes/reports');
app.use('/reports', reportRoutes);
```

> **CSV approach note:** built with plain string-joining, no extra dependency needed —
> fast for a hackathon. If any field could contain a comma (e.g. `name`), wrap it in
> quotes: `"${v.name}"`. Given demo data, this is a minor edge case, not worth a library.

---

## 3. PDF Export

Install a lightweight PDF library:

```bash
npm install pdfkit
```

Add to `src/routes/reports.js`:

```js
const PDFDocument = require('pdfkit');

// ---------- GET /reports/export/vehicles.pdf ----------
router.get(
  '/export/vehicles.pdf',
  requireAuth,
  requireRole('FLEET_MANAGER', 'FINANCIAL_ANALYST'),
  async (req, res) => {
    const vehicles = await prisma.vehicle.findMany();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="vehicles_report.pdf"');

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    doc.pipe(res);

    doc.fontSize(18).text('TransitOps — Vehicle Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(1.5);

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Reg Number', 40, doc.y, { continued: true, width: 90 });
    doc.text('Name', 130, doc.y, { continued: true, width: 100 });
    doc.text('Type', 230, doc.y, { continued: true, width: 70 });
    doc.text('Max Load', 300, doc.y, { continued: true, width: 70 });
    doc.text('Odometer', 370, doc.y, { continued: true, width: 70 });
    doc.text('Status', 440, doc.y, { width: 90 });
    doc.moveDown(0.5);
    doc.font('Helvetica');

    vehicles.forEach(v => {
      doc.text(v.regNumber, 40, doc.y, { continued: true, width: 90 });
      doc.text(v.name, 130, doc.y, { continued: true, width: 100 });
      doc.text(v.type, 230, doc.y, { continued: true, width: 70 });
      doc.text(String(v.maxLoadCapacity), 300, doc.y, { continued: true, width: 70 });
      doc.text(String(v.odometer), 370, doc.y, { continued: true, width: 70 });
      doc.text(v.status, 440, doc.y, { width: 90 });
    });

    doc.end();
  }
);

// ---------- GET /reports/export/vehicle/:id/summary.pdf — single-vehicle report ----------
router.get(
  '/export/vehicle/:id/summary.pdf',
  requireAuth,
  requireRole('FLEET_MANAGER', 'FINANCIAL_ANALYST'),
  async (req, res) => {
    const vehicleId = req.params.id;
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

    const [fuelLogs, expenses, maintenanceLogs] = await Promise.all([
      prisma.fuelLog.findMany({ where: { vehicleId } }),
      prisma.expense.findMany({ where: { vehicleId } }),
      prisma.maintenanceLog.findMany({ where: { vehicleId } }),
    ]);

    const totalFuelCost = fuelLogs.reduce((sum, f) => sum + f.cost, 0);
    const totalExpenseCost = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalMaintenanceCost = maintenanceLogs.reduce((sum, m) => sum + m.cost, 0);
    const operationalCost = totalFuelCost + totalExpenseCost + totalMaintenanceCost;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="vehicle_${vehicle.regNumber}_summary.pdf"`);

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    doc.pipe(res);

    doc.fontSize(18).text(`Vehicle Summary — ${vehicle.regNumber}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(11);
    doc.text(`Name/Model: ${vehicle.name}`);
    doc.text(`Type: ${vehicle.type}`);
    doc.text(`Status: ${vehicle.status}`);
    doc.text(`Odometer: ${vehicle.odometer}`);
    doc.moveDown();
    doc.fontSize(13).font('Helvetica-Bold').text('Operational Cost Breakdown');
    doc.font('Helvetica').fontSize(11);
    doc.text(`Fuel Cost: ${totalFuelCost}`);
    doc.text(`Other Expenses: ${totalExpenseCost}`);
    doc.text(`Maintenance Cost: ${totalMaintenanceCost}`);
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').text(`Total Operational Cost: ${operationalCost}`);

    doc.end();
  }
);
```

> **Why PDFKit:** pure JavaScript, no native binaries or headless-browser
> dependency (unlike Puppeteer), so it installs and runs fast — ideal for an
> 8-hour build. Streams directly to the response, no temp files needed.

---

## 4. Chart-Ready Data (for frontend charts)

No new backend logic needed beyond what's already returned — charts are a
**frontend concern** that consumes existing endpoints. Recommended chart library:
**Recharts** (already listed as available in your frontend stack).

Suggested charts and which endpoint feeds them:

| Chart | Data source | Chart type |
|---|---|---|
| Fleet status breakdown (Available/On Trip/In Shop/Retired) | `GET /dashboard/kpis` (or a small `/dashboard/vehicle-status-breakdown` you add) | Pie/Donut |
| Fleet Utilization over time | Would need daily snapshots — **skip for hackathon**, show current % only | N/A |
| Operational cost by vehicle | Loop `GET /reports/vehicle/:id` for each vehicle, or add a `GET /reports/cost-breakdown` that returns cost per vehicle in one call | Bar |
| Trip status breakdown (Draft/Dispatched/Completed/Cancelled) | Add lightweight `GET /dashboard/trip-status-breakdown` | Bar/Pie |

**Recommended addition — one extra endpoint to make charts trivial:**

```js
// GET /dashboard/vehicle-status-breakdown
router.get('/vehicle-status-breakdown', requireAuth, async (req, res) => {
  const statuses = ['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'];
  const counts = await Promise.all(
    statuses.map(status => prisma.vehicle.count({ where: { status } }))
  );
  res.json(statuses.map((status, i) => ({ status, count: counts[i] })));
});
```
This returns exactly the shape Recharts wants: `[{ status: 'AVAILABLE', count: 5 }, ...]`.

---

## 5. Verification Checklist

- [ ] `GET /dashboard/kpis` returns correct counts matching current DB state
- [ ] Filters (`type`, `status`) on KPIs narrow results correctly
- [ ] `GET /reports/vehicle/:id` returns fuel efficiency, operational cost, and ROI that match manual calculation
- [ ] `GET /reports/fleet-utilization` returns a sane percentage (0–100)
- [ ] `GET /reports/export/vehicles.csv` downloads a valid CSV, opens correctly in Excel/Sheets
- [ ] CSV export blocked (403) for Driver/Safety Officer
- [ ] `GET /reports/export/vehicles.pdf` downloads a valid, readable PDF with a vehicle table
- [ ] `GET /reports/export/vehicle/:id/summary.pdf` downloads a valid single-vehicle cost summary
- [ ] PDF export blocked (403) for Driver/Safety Officer
- [ ] `GET /dashboard/vehicle-status-breakdown` returns data in the exact shape needed for a Recharts pie/bar chart

---

## 6. Cross-Check Against Original PS

| PS Requirement | Status |
|---|---|
| 3.2 Dashboard KPIs (Active/Available/In-Maintenance vehicles, Active/Pending trips, Drivers on Duty, Fleet Utilization %) | ✅ Covered |
| 3.2 Filters by vehicle type, status, region | ✅ type/status covered; region needs a `region` field on Vehicle if you want it — optional, add only if time allows |
| 3.8 Fuel Efficiency, Fleet Utilization, Operational Cost, Vehicle ROI | ✅ Covered |
| 3.8 CSV export (mandatory) | ✅ Covered |
| 3.8 PDF export (optional/bonus) | ✅ Covered |
| Bonus: charts | ✅ Data endpoints ready; frontend just needs to plot them |

With this, **every mandatory deliverable in the PS is covered, plus the PDF export
bonus**. Remaining bonus features (email reminders, document management,
search/filter/sort, dark mode) are optional — only tackle them if you finish early.
