# TransitOps Hackathon Prototype

TransitOps is a browser-based smart transport operations platform built for the
8-hour hackathon brief. It digitizes fleet assets, drivers, trips, maintenance,
fuel, expenses, and analytics with real business-rule enforcement in the UI.

## Run

Open `index.html` in any modern browser. No backend or package install is
required.

## Demo Login

All demo users use password `demo123`.

| Role | Email |
| --- | --- |
| Fleet Manager | admin@transitops.io |
| Driver | driver@transitops.io |
| Safety Officer | safety@transitops.io |
| Financial Analyst | finance@transitops.io |

## Best Demo Flow

1. Sign in as Fleet Manager.
2. Open Dashboard and show KPIs, filters, utilization, and license alerts.
3. Open Vehicles and add `Van-05` style vehicle data. Duplicate registration is blocked.
4. Open Drivers and show license expiry, safety score, suspended driver blocking, and reminders.
5. Open Trips and create a trip with an available vehicle and driver.
6. Dispatch the trip and show vehicle plus driver status changing to `On Trip`.
7. Complete the trip and enter odometer, distance, fuel, and fuel cost.
8. Open Maintenance, create a maintenance record, and show vehicle status changing to `In Shop`.
9. Open Expenses and Analytics to show fuel efficiency, operational cost, ROI, CSV export, and PDF export through browser print.
10. Try another role to show RBAC navigation.

## Covered Requirements

- Email/password login with role-based access control.
- Dashboard KPIs for vehicles, trips, drivers, utilization, maintenance, and alerts.
- Vehicle registry with unique registration number validation.
- Driver management with license expiry and suspension rules.
- Trip lifecycle: Draft, Dispatched, Completed, Cancelled.
- Dispatch validation for vehicle availability, driver compliance, load capacity, and double booking.
- Automatic status transitions for dispatch, completion, cancellation, and maintenance.
- Maintenance log that removes vehicles from dispatch selection.
- Fuel logs and operational expenses.
- Analytics for fuel efficiency, fleet utilization, operational cost, and ROI.
- CSV export for major datasets.
- Browser print flow for PDF export.
- Bonus: dark mode, document expiry tracking, reminder simulation, search, filters, and sorting.

## Notes

The app uses browser `localStorage` for demo persistence. Use `Reset demo` to
restore the original seed data.

## UI Direction

The interface follows the imported Stitch command-center reference: fixed left
navigation, fixed top command bar, black operational frame, 32px dot grid,
square panels, dense KPI cards, uppercase labels, and monochrome controls with
status-only accents.
