const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requireRole } = require('../middleware/auth');

const prisma = new PrismaClient();

const CAN_MANAGE_TRIPS = ['FLEET_MANAGER', 'DRIVER'];

// ---------- Helper: validate a vehicle/driver pair is assignable ----------
async function validateAssignment(vehicleId, driverId, cargoWeight) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  const driver = await prisma.driver.findUnique({ where: { id: driverId } });

  if (!vehicle) return 'Vehicle not found';
  if (!driver) return 'Driver not found';

  if (['IN_SHOP', 'RETIRED'].includes(vehicle.status)) return 'Vehicle is not available for dispatch';
  if (vehicle.status === 'ON_TRIP') return 'Vehicle is already on a trip';

  if (driver.status === 'SUSPENDED') return 'Driver is suspended';
  if (driver.status === 'ON_TRIP') return 'Driver is already on a trip';
  if (new Date(driver.licenseExpiry) < new Date()) return 'Driver license has expired';

  if (cargoWeight > vehicle.maxLoadCapacity) return 'Cargo weight exceeds vehicle max load capacity';

  return null; // no error
}

// ---------- GET /trips — all roles can view ----------
router.get('/', requireAuth, async (req, res) => {
  const { status } = req.query;
  const trips = await prisma.trip.findMany({
    where: { ...(status && { status }) },
    orderBy: { createdAt: 'desc' },
  });
  res.json(trips);
});

router.get('/:id', requireAuth, async (req, res) => {
  const trip = await prisma.trip.findUnique({ where: { id: req.params.id } });
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  res.json(trip);
});

// ---------- POST /trips — create Draft ----------
router.post('/', requireAuth, requireRole(...CAN_MANAGE_TRIPS), async (req, res) => {
  const { source, destination, vehicleId, driverId, cargoWeight, plannedDistance } = req.body;

  if (!source || !destination || !vehicleId || !driverId || !cargoWeight || !plannedDistance) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
  if (cargoWeight > vehicle.maxLoadCapacity) {
    return res.status(400).json({ error: 'Cargo weight exceeds vehicle max load capacity' });
  }

  const trip = await prisma.trip.create({
    data: { source, destination, vehicleId, driverId, cargoWeight, plannedDistance },
  });

  res.status(201).json(trip);
});

// ---------- PATCH /trips/:id/reassign — change driver/vehicle (Draft or Dispatched) ----------
router.patch('/:id/reassign', requireAuth, requireRole(...CAN_MANAGE_TRIPS), async (req, res) => {
  const { vehicleId, driverId } = req.body;
  const trip = await prisma.trip.findUnique({ where: { id: req.params.id } });

  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  if (!['DRAFT', 'DISPATCHED'].includes(trip.status)) {
    return res.status(400).json({ error: 'Can only reassign trips that are Draft or Dispatched' });
  }

  const newVehicleId = vehicleId || trip.vehicleId;
  const newDriverId = driverId || trip.driverId;

  // If trip is currently Dispatched, validate the new pair as if dispatching fresh
  if (trip.status === 'DISPATCHED') {
    const error = await validateAssignment(newVehicleId, newDriverId, trip.cargoWeight);
    if (error) return res.status(400).json({ error });

    // Release old vehicle/driver back to Available
    await prisma.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'AVAILABLE' } });
    await prisma.driver.update({ where: { id: trip.driverId }, data: { status: 'AVAILABLE' } });

    // Put new vehicle/driver On Trip
    await prisma.vehicle.update({ where: { id: newVehicleId }, data: { status: 'ON_TRIP' } });
    await prisma.driver.update({ where: { id: newDriverId }, data: { status: 'ON_TRIP' } });
  } else {
    // Draft: just validate cargo weight against new vehicle if vehicle changed
    if (vehicleId) {
      const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
      if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
      if (trip.cargoWeight > vehicle.maxLoadCapacity) {
        return res.status(400).json({ error: 'Cargo weight exceeds new vehicle max load capacity' });
      }
    }
  }

  const updatedTrip = await prisma.trip.update({
    where: { id: req.params.id },
    data: { vehicleId: newVehicleId, driverId: newDriverId },
  });

  res.json(updatedTrip);
});

// ---------- PATCH /trips/:id/dispatch ----------
router.patch('/:id/dispatch', requireAuth, requireRole(...CAN_MANAGE_TRIPS), async (req, res) => {
  const { estimatedFuelLevelStart, odometerStart, vehicleCondition, maintenanceNote } = req.body;
  const trip = await prisma.trip.findUnique({ where: { id: req.params.id } });

  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  if (trip.status !== 'DRAFT') return res.status(400).json({ error: 'Only Draft trips can be dispatched' });

  const error = await validateAssignment(trip.vehicleId, trip.driverId, trip.cargoWeight);
  if (error) return res.status(400).json({ error });

  await prisma.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'ON_TRIP' } });
  await prisma.driver.update({ where: { id: trip.driverId }, data: { status: 'ON_TRIP' } });

  const updatedTrip = await prisma.trip.update({
    where: { id: req.params.id },
    data: {
      status: 'DISPATCHED',
      odometerStart,
      estimatedFuelLevelStart,
      vehicleCondition, // 'GOOD' | 'FAIR' | 'POOR'
      maintenanceNote,
    },
  });

  res.json(updatedTrip);
});

// ---------- PATCH /trips/:id/complete ----------
router.patch('/:id/complete', requireAuth, requireRole(...CAN_MANAGE_TRIPS), async (req, res) => {
  const { odometerEnd, finalFuelLevel, fuelBillAmount } = req.body;
  const trip = await prisma.trip.findUnique({ where: { id: req.params.id } });

  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  if (trip.status !== 'DISPATCHED') return res.status(400).json({ error: 'Only Dispatched trips can be completed' });

  await prisma.vehicle.update({
    where: { id: trip.vehicleId },
    data: { status: 'AVAILABLE', odometer: odometerEnd },
  });
  await prisma.driver.update({ where: { id: trip.driverId }, data: { status: 'AVAILABLE' } });

  const updatedTrip = await prisma.trip.update({
    where: { id: req.params.id },
    data: { status: 'COMPLETED', odometerEnd, finalFuelLevel, fuelBillAmount },
  });

  res.json(updatedTrip);
});

// ---------- PATCH /trips/:id/cancel ----------
router.patch('/:id/cancel', requireAuth, requireRole(...CAN_MANAGE_TRIPS), async (req, res) => {
  const trip = await prisma.trip.findUnique({ where: { id: req.params.id } });

  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  if (trip.status !== 'DISPATCHED') return res.status(400).json({ error: 'Only Dispatched trips can be cancelled' });

  await prisma.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'AVAILABLE' } });
  await prisma.driver.update({ where: { id: trip.driverId }, data: { status: 'AVAILABLE' } });

  const updatedTrip = await prisma.trip.update({
    where: { id: req.params.id },
    data: { status: 'CANCELLED' },
  });

  res.json(updatedTrip);
});

module.exports = router;
