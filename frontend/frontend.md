# TransitOps Frontend — UI Design Reference

This document outlines the UI architecture, layouts, components, and API integration guidelines for the TransitOps frontend application, based on the backend modules implemented so far (Auth, Vehicle Registry, Driver Management, and Trip Management).

---

## 1. Design System & Aesthetics
- **Theme**: Sleek dark mode / premium dashboard design.
- **Color Palette**:
  - Background: Slate / Charcoal (`#0B0F19`, `#111827`)
  - Surface/Cards: Dark Navy (`#1F2937` or HSL styled glassmorphism)
  - Primary Active: Vibrant Indigo (`#6366F1`) or Electric Violet
  - Accent / Positive: Emerald Green (`#10B981`)
  - Warning / Warning: Amber (`#F59E0B`)
  - Danger / Cancelled: Rose Red (`#F43F5E`)
- **Typography**: Modern Sans-Serif (e.g., Inter, Outfit, or Roboto).
- **Interactions**: Soft hover states, micro-transitions on buttons, card-scaling, and loading skeletons.

---

## 2. Authentication Screen
- **Route**: `/login`
- **UI Elements**:
  - Centered clean card layout.
  - Inputs: Email Address, Password.
  - Error message alerts (e.g., "Invalid credentials").
- **Integration**:
  - `POST /auth/login`
  - Success response stores the `token` and `user` object in `localStorage` or `sessionStorage`.
  - Redirects user to the main `/dashboard`.

---

## 3. Layout Structure
- **Sidebar**:
  - Navigation links: Dashboard, Vehicles, Drivers, Trips.
  - User profile block at bottom showing current user's Name, Role badge (colored by role), and Logout action.
- **Header**:
  - Breadcrumbs / Page Title.
  - Notifications / status indicator.
  - Health status indicator of backend (`GET /health`).

---

## 4. Dashboard View
- **Route**: `/dashboard`
- **Stats Widgets**:
  - **Total Vehicles**: Count of active registry.
  - **Active Trips**: Count of trips with status `DISPATCHED`.
  - **Available Drivers**: Count of drivers with status `AVAILABLE` and valid licenses.
- **Recent Activities / Logs**:
  - A small feed showing recently updated trips or registrations.

---

## 5. Vehicle Registry
- **Route**: `/vehicles`
- **Table / Grid View**:
  - Columns: Registration No, Name, Type, Max Capacity, Odometer, Acquisition Cost, Status badge.
  - Filtering: Quick filter buttons for status (`AVAILABLE`, `ON_TRIP`, `IN_SHOP`, `RETIRED`) and Search bar.
- **Actions (Fleet Manager only)**:
  - **"Register Vehicle" Button**: Opens modal form:
    - Input: Registration Number (Unique), Name, Type, Max Load Capacity, Odometer, Acquisition Cost.
  - **"Edit" Action**: Pre-fills modal to edit details (disabled status changes if vehicle is ON_TRIP).
  - **"Delete" Action**: Confirms deletion.
- **Read-Only Mode**:
  - Drivers, Safety Officers, and Financial Analysts see the table and details but all forms, edit, and delete buttons are hidden/disabled.

---

## 6. Driver Management
- **Route**: `/drivers`
- **Table / Grid View**:
  - Columns: Driver Name, License No, Category, Expiry Date, Contact No, Safety Score, Status badge.
  - Formatting: Driver licenses expired or expiring within 30 days highlighted in Amber/Red.
- **Actions (Fleet Manager & Safety Officer)**:
  - **"Register Driver" Button** (Fleet Manager only):
    - Input: Name, License No, Category, Expiry Date, Contact.
  - **"Edit Details" Button**:
    - **Fleet Manager**: Can edit all fields (Name, License details, Status, Score, Contact).
    - **Safety Officer**: Can ONLY edit `status` and `safetyScore` (all other inputs in the edit modal are disabled/read-only).
  - **"Delete" Button** (Fleet Manager only): Confirms removal.

---

## 7. Trip Management
- **Route**: `/trips`
- **Trip Status Pipeline**:
  - Visual timeline/pipeline status cards: `DRAFT` ➔ `DISPATCHED` ➔ `COMPLETED` / `CANCELLED`.
- **API Forms & Actions (Fleet Manager & Drivers)**:
  - **"Create Trip Draft"**:
    - Inputs: Source, Destination, Vehicle Selection (Dropdown), Driver Selection (Dropdown), Cargo Weight, Planned Distance.
    - Capacity check warning if `Cargo Weight > Vehicle.maxLoadCapacity`.
  - **"Dispatch Trip" Button** (Visible on Draft trips):
    - Opens Dispatch Modal:
      - Inputs: Odometer Start (Prefilled with Vehicle's current odometer), Estimated Fuel Level Start (%), Vehicle Condition (Good/Fair/Poor), Maintenance Note.
      - Blocks dispatch if Driver is Suspended or has an expired license, or if Vehicle is already on another trip.
  - **"Reassign" Button** (Visible on Draft or Dispatched trips):
    - Opens Reassignment Modal to change Driver/Vehicle.
    - If dispatched: automatically returns old pair to `AVAILABLE` and puts new pair to `ON_TRIP`.
  - **"Complete Trip" Button** (Visible on Dispatched trips):
    - Opens Completion Modal:
      - Inputs: Odometer End (validate `> Odometer Start`), Final Fuel Level (%), Fuel Bill Amount.
      - Upon completion, returns vehicle and driver status back to `AVAILABLE` and updates the vehicle's odometer value.
  - **"Cancel Trip" Button** (Visible on Dispatched trips):
    - Confirms cancellation, setting status to `CANCELLED` and releasing the vehicle and driver back to `AVAILABLE`.