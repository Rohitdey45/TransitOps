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
    // region filter placeholder
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

// GET /dashboard/vehicle-status-breakdown
router.get('/vehicle-status-breakdown', requireAuth, async (req, res) => {
  const statuses = ['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'];
  const counts = await Promise.all(
    statuses.map(status => prisma.vehicle.count({ where: { status } }))
  );
  res.json(statuses.map((status, i) => ({ status, count: counts[i] })));
});

module.exports = router;
