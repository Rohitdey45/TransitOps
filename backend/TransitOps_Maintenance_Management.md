# TransitOps Backend — Maintenance Management

Scope: Maintenance record creation/closure, with automatic vehicle status flips,
per spec section 3.6 and the mandatory business rules in section 4.

## Role Permissions for This Phase

| Action | Fleet Manager | Driver | Safety Officer | Financial Analyst |
|---|---|---|---|---|
| Create maintenance record | ✅ | View only | ✅ | View only |
| Close maintenance record | ✅ | View only | ✅ | View only |
| View maintenance records | ✅ | ✅ | ✅ | ✅ |

---

## 1. Update Prisma Schema

Add to `prisma/schema.prisma`:

```prisma
model MaintenanceLog {
  id          String   @id @default(uuid())
  vehicleId   String
  reason      String
  cost        Float    @default(0)
  status      MaintenanceStatus @default(OPEN)
  createdAt   DateTime @default(now())
  closedAt    DateTime?
}

enum MaintenanceStatus {
  OPEN
  CLOSED
}
```

> Note: `cost` here feeds directly into the operational cost calculation
> (Fuel + Maintenance) needed for Reports in the next phase — capture it now.

Run the migration:

```bash
npx prisma migrate dev --name add_maintenance
```

---

## 2. Maintenance Routes

Create `src/routes/maintenance.js`:

```js
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
```

---

## 3. Wire Routes into Server

Add to `src/server.js`:

```js
const maintenanceRoutes = require('./routes/maintenance');
app.use('/maintenance', maintenanceRoutes);
```

---

## 4. Business Rules Enforced (per spec section 3.6 & 4)

- Creating an active maintenance record automatically switches vehicle status to `IN_SHOP`, removing it from the dispatch/driver selection pool.
- Closing a maintenance record restores vehicle status to `AVAILABLE`, unless the vehicle is `RETIRED` (retired vehicles stay retired).
- A vehicle currently `ON_TRIP` cannot be sent to maintenance directly (must complete/cancel the trip first) — this guards data integrity even though not explicitly stated as a rule in the PS.
- Maintenance `cost` is captured now so it can feed the Reports module's operational cost formula (`Fuel + Maintenance`) later.

---

## 5. Cross-Check Against Original PS — Anything Else Needed?

Reviewing spec sections 3.6–3.8 against what's built/planned so far:

| PS Requirement | Status |
|---|---|
| 3.6 Create maintenance records | ✅ Covered above |
| 3.6 Auto-flip to In Shop / remove from dispatch pool | ✅ Covered above |
| 3.7 Fuel logs (liters, cost, date) | ⏳ Not yet built — next after this |
| 3.7 Other expenses (tolls, etc.) | ⏳ Not yet built — can fold into Fuel/Expense module |
| 3.7 Auto-compute total operational cost (Fuel + Maintenance) per vehicle | ⏳ Needs Fuel module first, then a small aggregation endpoint |
| 3.8 Fuel Efficiency, Fleet Utilization, Operational Cost, Vehicle ROI reports | ⏳ Reports module, after Fuel/Expense |
| 3.8 CSV export | ⏳ Reports module |
| 3.2 Dashboard KPIs | ⏳ Not yet built |

**Nothing missing from the Maintenance module itself** — it's fully aligned with the spec. The remaining PS-mandated work is exactly what's already on your list: Fuel & Expense → Reports (with CSV export) → Dashboard.

---

## Verification Checklist

- [ ] Create maintenance record as Fleet Manager → succeeds, vehicle flips to `IN_SHOP`
- [ ] Create maintenance record as Safety Officer → succeeds (same as above)
- [ ] Create maintenance record as Driver/Financial Analyst → 403
- [ ] Create maintenance record for a vehicle that's `ON_TRIP` → 400 error
- [ ] Vehicle in `IN_SHOP` no longer appears when creating/dispatching a new trip
- [ ] Close maintenance record → vehicle flips back to `AVAILABLE`
- [ ] Close maintenance record for a `RETIRED` vehicle → vehicle stays `RETIRED`, not `AVAILABLE`
- [ ] Attempting to close an already-closed record → 400 error
- [ ] All roles can `GET /maintenance` and view records

Once these pass, move to **Fuel & Expense Management** — fuel logs, expense tracking, and the operational cost calculation per vehicle.
