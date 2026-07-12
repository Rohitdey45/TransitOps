const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requireRole } = require('../middleware/auth');

const prisma = new PrismaClient();

// ---------- GET /expenses — all roles can view ----------
router.get('/', requireAuth, async (req, res) => {
  const { vehicleId, type } = req.query;
  const expenses = await prisma.expense.findMany({
    where: {
      ...(vehicleId && { vehicleId }),
      ...(type && { type }),
    },
    orderBy: { date: 'desc' },
  });
  res.json(expenses);
});

// ---------- POST /expenses — Fleet Manager only ----------
router.post('/', requireAuth, requireRole('FLEET_MANAGER'), async (req, res) => {
  const { vehicleId, type, amount, description, date } = req.body;

  if (!vehicleId || !type || !amount) {
    return res.status(400).json({ error: 'vehicleId, type, and amount are required' });
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

  const expense = await prisma.expense.create({
    data: {
      vehicleId,
      type,
      amount,
      description: description || null,
      date: date ? new Date(date) : new Date(),
    },
  });

  res.status(201).json(expense);
});

module.exports = router;
