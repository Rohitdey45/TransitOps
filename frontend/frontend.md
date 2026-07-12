# TransitOps Frontend — API Reference Guide

This document outlines the API endpoints, payload structures, query filters, headers, and authentication requirements for the TransitOps frontend application.

- **Base URL**: `http://localhost:4000`
- **Headers**:
  - For protected endpoints, pass the authorization token as a Bearer token:
    `Authorization: Bearer <JWT_TOKEN>`
  - Pass `"Content-Type": "application/json"` for POST/PATCH payloads.

---

## 1. Authentication

### POST `/auth/login`
- **Access**: Public
- **Description**: Authenticate a user and receive a JWT token.
- **Request Body**:
  ```json
  {
    "email": "manager@transitops.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "f75e4981-9670-4c30-a569-2ca4326dd2cb",
      "name": "Fleet Manager",
      "email": "manager@transitops.com",
      "role": "FLEET_MANAGER"
    }
  }
  ```
- **Error Response (401 Unauthorized)**:
  ```json
  { "error": "Invalid credentials" }
  ```

### GET `/auth/me`
- **Access**: Authenticated (All Roles)
- **Description**: Check current session token details.
- **Response (200 OK)**:
  ```json
  {
    "user": {
      "userId": "f75e4981-9670-4c30-a569-2ca4326dd2cb",
      "role": "FLEET_MANAGER",
      "name": "Fleet Manager",
      "iat": 1783840357,
      "exp": 1783869157
    }
  }
  ```

---

## 2. Vehicle Registry

### GET `/vehicles`
- **Access**: Authenticated (All Roles)
- **Description**: Retrieve a list of vehicles.
- **Query Parameters**:
  - `status` (optional): `AVAILABLE` | `ON_TRIP` | `IN_SHOP` | `RETIRED`
  - `type` (optional): Filter by vehicle model type (e.g. `Semi`, `Light`).
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "849397b9-5745-4e57-bbd5-4bba8d40eff4",
      "regNumber": "XYZ-1234",
      "name": "Heavy Truck A",
      "type": "Semi",
      "maxLoadCapacity": 15000,
      "odometer": 100,
      "acquisitionCost": 80000,
      "status": "AVAILABLE",
      "createdAt": "2026-07-12T07:12:52.406Z",
      "updatedAt": "2026-07-12T07:12:52.406Z"
    }
  ]
  ```

### GET `/vehicles/:id`
- **Access**: Authenticated (All Roles)
- **Description**: Retrieve detailed information for a single vehicle.
- **Response (200 OK)**: Single vehicle object (refer to vehicle structure above).

### POST `/vehicles`
- **Access**: Fleet Manager only
- **Description**: Register a new vehicle.
- **Request Body**:
  ```json
  {
    "regNumber": "XYZ-1234",
    "name": "Heavy Truck A",
    "type": "Semi",
    "maxLoadCapacity": 15000.0,
    "odometer": 100.0,
    "acquisitionCost": 80000.0
  }
  ```
- **Response (201 Created)**: Created vehicle object.
- **Error Responses**:
  - `400 Bad Request`: `{ "error": "Missing required fields" }`
  - `409 Conflict`: `{ "error": "Registration number already exists" }`

### PATCH `/vehicles/:id`
- **Access**: Fleet Manager only
- **Description**: Update an existing vehicle.
- **Request Body** (all fields optional):
  ```json
  {
    "name": "Heavy Truck A Modified",
    "type": "Heavy Semi",
    "maxLoadCapacity": 16000.0,
    "odometer": 120.0,
    "acquisitionCost": 82000.0,
    "status": "IN_SHOP"
  }
  ```
- **Response (200 OK)**: Updated vehicle object.

### DELETE `/vehicles/:id`
- **Access**: Fleet Manager only
- **Description**: Delete a vehicle.
- **Response (204 No Content)**: Empty body.

### GET `/vehicles/:id/operational-cost`
- **Access**: Authenticated (All Roles)
- **Description**: Fetch dynamic operating cost summary for a vehicle.
- **Response (200 OK)**:
  ```json
  {
    "vehicleId": "edddd404-532a-444e-bfc9-e314cea2746f",
    "totalFuelCost": 75,
    "totalExpenseCost": 15.5,
    "totalMaintenanceCost": 350,
    "totalOperationalCost": 440.5
  }
  ```

---

## 3. Driver Management

### GET `/drivers`
- **Access**: Authenticated (All Roles)
- **Description**: Retrieve a list of drivers.
- **Query Parameters**:
  - `status` (optional): `AVAILABLE` | `ON_TRIP` | `OFF_DUTY` | `SUSPENDED`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "865472cd-12d4-47b0-8cb7-4661b4473d56",
      "name": "John Doe",
      "licenseNumber": "LIC-98765",
      "licenseCategory": "Class A",
      "licenseExpiry": "2030-12-31T00:00:00.000Z",
      "contactNumber": "555-0199",
      "safetyScore": 100,
      "status": "AVAILABLE",
      "createdAt": "2026-07-12T07:13:20.580Z",
      "updatedAt": "2026-07-12T07:13:20.580Z"
    }
  ]
  ```

### GET `/drivers/:id`
- **Access**: Authenticated (All Roles)
- **Description**: Retrieve details for a single driver.
- **Response (200 OK)**: Single driver object (refer to driver structure above).

### POST `/drivers`
- **Access**: Fleet Manager only
- **Description**: Register a new driver.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "licenseNumber": "LIC-98765",
    "licenseCategory": "Class A",
    "licenseExpiry": "2030-12-31",
    "contactNumber": "555-0199"
  }
  ```
- **Response (201 Created)**: Created driver object.
- **Error Responses**:
  - `400 Bad Request`: `{ "error": "Missing required fields" }`
  - `409 Conflict`: `{ "error": "License number already exists" }`

### PATCH `/drivers/:id`
- **Access**: Fleet Manager & Safety Officer
- **Description**: Update driver details.
  - *Fleet Manager*: Full access to change all fields.
  - *Safety Officer*: Restricted access. Can only modify `status` and `safetyScore`. (Other fields passed in payload are ignored).
- **Request Body** (optional fields):
  ```json
  {
    "name": "John Doe Junior",
    "status": "SUSPENDED",
    "safetyScore": 85
  }
  ```
- **Response (200 OK)**: Updated driver object.

### DELETE `/drivers/:id`
- **Access**: Fleet Manager only
- **Description**: Delete a driver.
- **Response (204 No Content)**: Empty body.

---

## 4. Trip Management

### GET `/trips`
- **Access**: Authenticated (All Roles)
- **Description**: Fetch list of trips.
- **Query Parameters**:
  - `status` (optional): `DRAFT` | `DISPATCHED` | `COMPLETED` | `CANCELLED`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "16c15cfc-7917-4974-8706-1c59c03b433f",
      "source": "Warehouse A",
      "destination": "Warehouse B",
      "vehicleId": "f4df7760-0cf2-4b69-8713-f21ed3de6184",
      "driverId": "e817b5c3-285b-4c74-bd9b-9fe811e01104",
      "cargoWeight": 5000,
      "plannedDistance": 120,
      "status": "DRAFT",
      "odometerStart": null,
      "estimatedFuelLevelStart": null,
      "vehicleCondition": null,
      "maintenanceNote": null,
      "odometerEnd": null,
      "finalFuelLevel": null,
      "fuelBillAmount": null,
      "createdAt": "2026-07-12T07:37:24.824Z",
      "updatedAt": "2026-07-12T07:37:24.824Z"
    }
  ]
  ```

### GET `/trips/:id`
- **Access**: Authenticated (All Roles)
- **Description**: Retrieve details for a single trip.
- **Response (200 OK)**: Single trip object (refer to trip structure above).

### POST `/trips`
- **Access**: Fleet Manager & Driver
- **Description**: Create a new Trip in `DRAFT` status.
- **Request Body**:
  ```json
  {
    "source": "Warehouse A",
    "destination": "Warehouse B",
    "vehicleId": "f4df7760-0cf2-4b69-8713-f21ed3de6184",
    "driverId": "e817b5c3-285b-4c74-bd9b-9fe811e01104",
    "cargoWeight": 5000.0,
    "plannedDistance": 120.0
  }
  ```
- **Response (201 Created)**: Created trip object.
- **Error Responses**:
  - `400 Bad Request`: `{ "error": "Cargo weight exceeds vehicle max load capacity" }`
  - `404 Not Found`: `{ "error": "Vehicle not found" }`

### PATCH `/trips/:id/dispatch`
- **Access**: Fleet Manager & Driver
- **Description**: Dispatch a Draft trip. Flips vehicle/driver statuses to `ON_TRIP`.
- **Request Body**:
  ```json
  {
    "estimatedFuelLevelStart": 80.0,
    "odometerStart": 100.0,
    "vehicleCondition": "GOOD",
    "maintenanceNote": "Check tire pressure"
  }
  ```
- **Response (200 OK)**: Dispatched trip object.
- **Error Responses**:
  - `400 Bad Request`: `{ "error": "Vehicle is already on a trip" }` / `[Driver is suspended/Driver license has expired/Vehicle is not available]`

### PATCH `/trips/:id/reassign`
- **Access**: Fleet Manager & Driver
- **Description**: Reassign vehicle and/or driver on `DRAFT` or `DISPATCHED` trips. If dispatched, frees the old pair and books the new pair automatically.
- **Request Body** (optional fields):
  ```json
  {
    "vehicleId": "new-vehicle-uuid",
    "driverId": "new-driver-uuid"
  }
  ```
- **Response (200 OK)**: Updated trip object.

### PATCH `/trips/:id/complete`
- **Access**: Fleet Manager & Driver
- **Description**: Mark a Dispatched trip as `COMPLETED`. Flips vehicle/driver back to `AVAILABLE`, and registers final distance/fuel details.
- **Request Body**:
  ```json
  {
    "odometerEnd": 220.0,
    "finalFuelLevel": 35.0,
    "fuelBillAmount": 50.0
  }
  ```
- **Response (200 OK)**: Completed trip object.

### PATCH `/trips/:id/cancel`
- **Access**: Fleet Manager & Driver
- **Description**: Cancel a Dispatched trip. Sets status to `CANCELLED` and releases vehicle and driver back to `AVAILABLE`.
- **Response (200 OK)**: Cancelled trip object.

---

## 5. Maintenance Management

### GET `/maintenance`
- **Access**: Authenticated (All Roles)
- **Description**: Fetch maintenance records.
- **Query Parameters**:
  - `status` (optional): `OPEN` | `CLOSED`
  - `vehicleId` (optional): Filter logs by vehicle.
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "8f992ba9-59b6-480a-9b2c-765cc1ba831a",
      "vehicleId": "edddd404-532a-444e-bfc9-e314cea2746f",
      "reason": "Engine Overheat",
      "cost": 350,
      "status": "OPEN",
      "createdAt": "2026-07-12T08:02:49.583Z",
      "closedAt": null
    }
  ]
  ```

### POST `/maintenance`
- **Access**: Fleet Manager & Safety Officer
- **Description**: Create an `OPEN` maintenance log. Automatically flips vehicle status to `IN_SHOP`.
- **Request Body**:
  ```json
  {
    "vehicleId": "edddd404-532a-444e-bfc9-e314cea2746f",
    "reason": "Engine Overheat",
    "cost": 350.0
  }
  ```
- **Response (201 Created)**: Created log object.
- **Error Responses**:
  - `400 Bad Request`: `{ "error": "Cannot send a vehicle to maintenance while it is on a trip" }`
  - `404 Not Found`: `{ "error": "Vehicle not found" }`

### PATCH `/maintenance/:id/close`
- **Access**: Fleet Manager & Safety Officer
- **Description**: Close an open maintenance log. Flips vehicle status back to `AVAILABLE` (unless retired).
- **Response (200 OK)**: Closed log object.
- **Error Responses**:
  - `400 Bad Request`: `{ "error": "Maintenance record already closed" }`

---

## 6. Fuel & Expenses

### GET `/fuel-logs`
- **Access**: Authenticated (All Roles)
- **Description**: Fetch fuel consumption logs.
- **Query Parameters**:
  - `vehicleId` (optional): Filter logs by vehicle.
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "9456e0b2-1ef2-4238-b5e8-cec626c5572d",
      "vehicleId": "edddd404-532a-444e-bfc9-e314cea2746f",
      "tripId": null,
      "liters": 50,
      "cost": 75,
      "date": "2026-07-12T08:21:14.298Z",
      "createdAt": "2026-07-12T08:21:14.307Z"
    }
  ]
  ```

### POST `/fuel-logs`
- **Access**: Fleet Manager & Driver
- **Description**: Log a new fuel purchase.
- **Request Body**:
  ```json
  {
    "vehicleId": "edddd404-532a-444e-bfc9-e314cea2746f",
    "tripId": "optional-trip-uuid",
    "liters": 50.0,
    "cost": 75.0,
    "date": "2026-07-12T13:45:00.000Z"
  }
  ```
- **Response (201 Created)**: Created fuel log.

### GET `/expenses`
- **Access**: Authenticated (All Roles)
- **Description**: Fetch toll, parking, or fine expenses.
- **Query Parameters**:
  - `vehicleId` (optional): Filter expenses by vehicle.
  - `type` (optional): `TOLL` | `FINE` | `PARKING` | `OTHER`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "b2b8e9d9-f20f-4ba2-a1a6-1c6d4dbc4b84",
      "vehicleId": "edddd404-532a-444e-bfc9-e314cea2746f",
      "type": "TOLL",
      "amount": 15.5,
      "description": "Highway toll",
      "date": "2026-07-12T08:21:21.511Z",
      "createdAt": "2026-07-12T08:21:21.520Z"
    }
  ]
  ```

### POST `/expenses`
- **Access**: Fleet Manager only
- **Description**: Log general expense transaction.
- **Request Body**:
  ```json
  {
    "vehicleId": "edddd404-532a-444e-bfc9-e314cea2746f",
    "type": "TOLL",
    "amount": 15.5,
    "description": "Highway toll",
    "date": "2026-07-12T13:45:00.000Z"
  }
  ```
- **Response (201 Created)**: Created expense object.

---

## 7. Dashboard & Analytics

### GET `/dashboard/kpis`
- **Access**: Authenticated (All Roles)
- **Description**: Fetch central fleet metrics dashboard.
- **Query Parameters** (optional filters):
  - `type`: Filter by vehicle type (e.g. `Semi`, `Box Truck`).
  - `status`: Filter by vehicle status (`AVAILABLE`, `ON_TRIP`, `IN_SHOP`).
- **Response (200 OK)**:
  ```json
  {
    "activeVehicles": 2,
    "availableVehicles": 2,
    "vehiclesInMaintenance": 0,
    "activeTrips": 0,
    "pendingTrips": 0,
    "driversOnDuty": 2,
    "fleetUtilization": 0.0
  }
  ```

### GET `/dashboard/vehicle-status-breakdown`
- **Access**: Authenticated (All Roles)
- **Description**: Returns data formatted for graphing components (e.g. Recharts).
- **Response (200 OK)**:
  ```json
  [
    { "status": "AVAILABLE", "count": 2 },
    { "status": "ON_TRIP", "count": 0 },
    { "status": "IN_SHOP", "count": 0 },
    { "status": "RETIRED", "count": 0 }
  ]
  ```

### GET `/reports/fleet-utilization`
- **Access**: Authenticated (All Roles)
- **Description**: Get utilization metrics.
- **Response (200 OK)**:
  ```json
  {
    "totalVehicles": 2,
    "onTrip": 0,
    "fleetUtilization": 0.0
  }
  ```

### GET `/reports/vehicle/:id`
- **Access**: Authenticated (All Roles)
- **Description**: Get analytics report (Distance, Fuel efficiency, cost, ROI) for a vehicle.
- **Query Parameters**:
  - `revenue` (optional): Estimated revenue to check vehicle ROI calculation.
- **Response (200 OK)**:
  ```json
  {
    "vehicleId": "edddd404-532a-444e-bfc9-e314cea2746f",
    "regNumber": "XYZ-7777",
    "totalDistance": 0,
    "totalFuelLiters": 50,
    "fuelEfficiency": 0,
    "operationalCost": 440.5,
    "revenue": 0,
    "roi": -0.0176
  }
  ```

---

## 8. Export Options

### GET `/reports/export/vehicles.csv`
- **Access**: Fleet Manager & Financial Analyst
- **Description**: Export entire vehicle registry to CSV.
- **Headers**:
  - `Content-Type: text/csv`
  - `Content-Disposition: attachment; filename="vehicles_report.csv"`
- **Response**: Streamed CSV file content.

### GET `/reports/export/vehicles.pdf`
- **Access**: Fleet Manager & Financial Analyst
- **Description**: Export vehicle report table in printable A4 PDF format.
- **Headers**:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="vehicles_report.pdf"`
- **Response**: Streamed PDF binary data.

### GET `/reports/export/vehicle/:id/summary.pdf`
- **Access**: Fleet Manager & Financial Analyst
- **Description**: Export single-vehicle operating cost summary to PDF.
- **Headers**:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="vehicle_<reg_number>_summary.pdf"`
- **Response**: Streamed PDF binary data.