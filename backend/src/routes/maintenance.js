const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requireRole } = require('../middleware/auth');

const prisma = new PrismaClient();

const CAN_MANAGE_MAINTENANCE = ['FLEET_MANAGER', 'SAFETY_OFFICER'];

// ---------- GET /maintenance — all roles can view ----------
router.get('/', requireAuth, async (req, res) => {
  const { status, vehicleId } = req.query;
  const logs = await prisma.maintenanceLog.findMany({
    where: {
      ...(status && { status }),
      ...(vehicleId && { vehicleId }),
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(logs);
});

router.get('/:id', requireAuth, async (req, res) => {
  const log = await prisma.maintenanceLog.findUnique({ where: { id: req.params.id } });
  if (!log) return res.status(404).json({ error: 'Maintenance record not found' });
  res.json(log);
});

// ---------- POST /maintenance — create record, flip vehicle to IN_SHOP ----------
router.post('/', requireAuth, requireRole(...CAN_MANAGE_MAINTENANCE), async (req, res) => {
  const { vehicleId, reason, cost } = req.body;

  if (!vehicleId || !reason) {
    return res.status(400).json({ error: 'vehicleId and reason are required' });
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

  if (vehicle.status === 'ON_TRIP') {
    return res.status(400).json({ error: 'Cannot send a vehicle to maintenance while it is on a trip' });
  }
  if (vehicle.status === 'RETIRED') {
    return res.status(400).json({ error: 'Cannot create a maintenance record for a retired vehicle' });
  }

  const log = await prisma.maintenanceLog.create({
    data: { vehicleId, reason, cost: cost || 0 },
  });

  // Business rule: creating an active maintenance record flips vehicle to IN_SHOP
  await prisma.vehicle.update({ where: { id: vehicleId }, data: { status: 'IN_SHOP' } });

  res.status(201).json(log);
});

// ---------- PATCH /maintenance/:id/close — flip vehicle back to AVAILABLE ----------
router.patch('/:id/close', requireAuth, requireRole(...CAN_MANAGE_MAINTENANCE), async (req, res) => {
  const log = await prisma.maintenanceLog.findUnique({ where: { id: req.params.id } });
  if (!log) return res.status(404).json({ error: 'Maintenance record not found' });
  if (log.status === 'CLOSED') return res.status(400).json({ error: 'Maintenance record already closed' });

  const updatedLog = await prisma.maintenanceLog.update({
    where: { id: req.params.id },
    data: { status: 'CLOSED', closedAt: new Date() },
  });

  const vehicle = await prisma.vehicle.findUnique({ where: { id: log.vehicleId } });

  // Business rule: closing maintenance restores vehicle to AVAILABLE, unless retired
  if (vehicle && vehicle.status !== 'RETIRED') {
    await prisma.vehicle.update({ where: { id: log.vehicleId }, data: { status: 'AVAILABLE' } });
  }

  res.json(updatedLog);
});

module.exports = router;
