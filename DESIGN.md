# TransitOps Website Design Prompt

```text
Design a frontend-only hackathon web app called TransitOps, a smart transport operations platform for fleet, driver, dispatch, maintenance, fuel, expense, and analytics management.

Visual style:
Create a premium dark command-center UI inspired by a black canvas with a thin white rectangular border. The layout should feel minimal, sharp, and futuristic, like an operations control console. Use a matte black background, thin white/gray borders, square corners, monochrome panels, subtle grid texture, and restrained contrast. Avoid colorful gradients, rounded cards, decorative blobs, and marketing-style hero sections.

Core layout:
- Full-screen black framed interface with 1px white border around the app.
- Left sidebar navigation for Dashboard, Vehicles, Drivers, Trips, Maintenance, Expenses, Analytics, Documents.
- Top header with page title and small action buttons.
- Dense dashboard-first experience, not a landing page.
- Use compact KPI cards, tables, forms, filters, and charts.
- Make all cards rectangular with square corners and thin borders.
- Keep typography clean, modern, uppercase labels, strong hierarchy, and high readability.

Pages/features:
1. Login screen with demo role selection and dark framed UI.
2. Dashboard with KPIs: Active Vehicles, Available Vehicles, Vehicles in Maintenance, Active Trips, Pending Trips, Drivers On Duty, Fleet Utilization, Compliance Alerts.
3. Vehicle Registry with add vehicle form, unique registration UI, status pills, filters, sorting.
4. Driver Management with license expiry, safety score, suspended status, compliance alerts.
5. Trip Management with create trip form, dispatch validation preview, trip lifecycle table.
6. Maintenance screen where active maintenance moves vehicle to In Shop.
7. Fuel and Expense management with fuel logs and cost ledger.
8. Analytics with fuel efficiency, operational cost, utilization, and ROI charts.
9. Vehicle Documents screen with expiry/reminder queue.
10. CSV export and browser print/PDF export buttons.

Interaction rules:
- Frontend only: HTML, CSS, and JavaScript.
- Use localStorage for demo data.
- Include role-based navigation UI.
- Include status transitions visually: Available, On Trip, In Shop, Retired, Suspended, Draft, Dispatched, Completed, Cancelled.
- Make it responsive for desktop and mobile.

Design details:
- Background: #101010 or near-black.
- Borders: thin rgba white/gray lines.
- Text: white primary, gray secondary.
- Buttons: outlined by default, filled white for primary actions.
- Tables: compact, bordered rows, hover state.
- Charts: monochrome bars/donut, no bright colors.
- Forms: dark inputs with thin borders.
- Use subtle grid texture inside the framed app container.
- Overall feel: serious, operational, hackathon-ready, polished SaaS control panel.
```
