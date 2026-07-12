const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requireRole } = require('../middleware/auth');
const PDFDocument = require('pdfkit');

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

module.exports = router;
