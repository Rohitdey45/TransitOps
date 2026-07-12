const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requireRole } = require('../middleware/auth');

const prisma = new PrismaClient();

// ---------- GET /fuel-logs — all roles can view ----------
router.get('/', requireAuth, async (req, res) => {
  const { vehicleId } = req.query;
  const logs = await prisma.fuelLog.findMany({
    where: { ...(vehicleId && { vehicleId }) },
    orderBy: { date: 'desc' },
  });
  res.json(logs);
});

// ---------- POST /fuel-logs — Fleet Manager or Driver ----------
router.post('/', requireAuth, requireRole('FLEET_MANAGER', 'DRIVER'), async (req, res) => {
  const { vehicleId, tripId, liters, cost, date } = req.body;

  if (!vehicleId || !liters || !cost) {
    return res.status(400).json({ error: 'vehicleId, liters, and cost are required' });
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

  const log = await prisma.fuelLog.create({
    data: {
      vehicleId,
      tripId: tripId || null,
      liters,
      cost,
      date: date ? new Date(date) : new Date(),
    },
  });

  res.status(201).json(log);
});

module.exports = router;
