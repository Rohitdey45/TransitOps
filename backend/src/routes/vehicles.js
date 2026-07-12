const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requireRole } = require('../middleware/auth');

const prisma = new PrismaClient();

// GET /vehicles — any authenticated role can view
router.get('/', requireAuth, async (req, res) => {
  const { status, type } = req.query;
  const vehicles = await prisma.vehicle.findMany({
    where: {
      ...(status && { status }),
      ...(type && { type }),
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(vehicles);
});

// GET /vehicles/:id
router.get('/:id', requireAuth, async (req, res) => {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: req.params.id } });
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
  res.json(vehicle);
});

// POST /vehicles — Fleet Manager only
router.post('/', requireAuth, requireRole('FLEET_MANAGER'), async (req, res) => {
  const { regNumber, name, type, maxLoadCapacity, odometer, acquisitionCost } = req.body;

  if (!regNumber || !name || !type || !maxLoadCapacity || !acquisitionCost) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const existing = await prisma.vehicle.findUnique({ where: { regNumber } });
  if (existing) {
    return res.status(409).json({ error: 'Registration number already exists' });
  }

  const vehicle = await prisma.vehicle.create({
    data: { regNumber, name, type, maxLoadCapacity, odometer: odometer || 0, acquisitionCost },
  });

  res.status(201).json(vehicle);
});

// PATCH /vehicles/:id — Fleet Manager only
router.patch('/:id', requireAuth, requireRole('FLEET_MANAGER'), async (req, res) => {
  const { name, type, maxLoadCapacity, odometer, acquisitionCost, status } = req.body;

  try {
    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: { name, type, maxLoadCapacity, odometer, acquisitionCost, status },
    });
    res.json(vehicle);
  } catch (err) {
    res.status(404).json({ error: 'Vehicle not found' });
  }
});

// DELETE /vehicles/:id — Fleet Manager only
router.delete('/:id', requireAuth, requireRole('FLEET_MANAGER'), async (req, res) => {
  try {
    await prisma.vehicle.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: 'Vehicle not found' });
  }
});

module.exports = router;
