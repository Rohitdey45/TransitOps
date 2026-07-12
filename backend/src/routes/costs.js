const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');

const prisma = new PrismaClient();

// ---------- GET /vehicles/:id/operational-cost ----------
router.get('/:id/operational-cost', requireAuth, async (req, res) => {
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

  const totalOperationalCost = totalFuelCost + totalExpenseCost + totalMaintenanceCost;

  res.json({
    vehicleId,
    totalFuelCost,
    totalExpenseCost,
    totalMaintenanceCost,
    totalOperationalCost,
  });
});

module.exports = router;
