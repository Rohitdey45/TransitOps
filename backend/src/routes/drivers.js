const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requireRole } = require('../middleware/auth');

const prisma = new PrismaClient();

// GET /drivers — any authenticated role can view
router.get('/', requireAuth, async (req, res) => {
  const { status } = req.query;
  const drivers = await prisma.driver.findMany({
    where: { ...(status && { status }) },
    orderBy: { createdAt: 'desc' },
  });
  res.json(drivers);
});

// GET /drivers/:id
router.get('/:id', requireAuth, async (req, res) => {
  const driver = await prisma.driver.findUnique({ where: { id: req.params.id } });
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  res.json(driver);
});

// POST /drivers — Fleet Manager only
router.post('/', requireAuth, requireRole('FLEET_MANAGER'), async (req, res) => {
  const { name, licenseNumber, licenseCategory, licenseExpiry, contactNumber } = req.body;

  if (!name || !licenseNumber || !licenseCategory || !licenseExpiry || !contactNumber) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const existing = await prisma.driver.findUnique({ where: { licenseNumber } });
  if (existing) {
    return res.status(409).json({ error: 'License number already exists' });
  }

  const driver = await prisma.driver.create({
    data: {
      name,
      licenseNumber,
      licenseCategory,
      licenseExpiry: new Date(licenseExpiry),
      contactNumber,
    },
  });

  res.status(201).json(driver);
});

// PATCH /drivers/:id — Fleet Manager: full edit. Safety Officer: status/safetyScore only.
router.patch('/:id', requireAuth, requireRole('FLEET_MANAGER', 'SAFETY_OFFICER'), async (req, res) => {
  const isSafetyOfficer = req.user.role === 'SAFETY_OFFICER';

  // Safety Officer can only touch status and safetyScore, nothing else
  const allowedFields = isSafetyOfficer
    ? { status: req.body.status, safetyScore: req.body.safetyScore }
    : req.body;

  try {
    const driver = await prisma.driver.update({
      where: { id: req.params.id },
      data: allowedFields,
    });
    res.json(driver);
  } catch (err) {
    res.status(404).json({ error: 'Driver not found' });
  }
});

// DELETE /drivers/:id — Fleet Manager only
router.delete('/:id', requireAuth, requireRole('FLEET_MANAGER'), async (req, res) => {
  try {
    await prisma.driver.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: 'Driver not found' });
  }
});

module.exports = router;
