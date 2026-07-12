-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "cargoWeight" REAL NOT NULL,
    "plannedDistance" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "odometerStart" REAL,
    "estimatedFuelLevelStart" REAL,
    "vehicleCondition" TEXT,
    "maintenanceNote" TEXT,
    "odometerEnd" REAL,
    "finalFuelLevel" REAL,
    "fuelBillAmount" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
