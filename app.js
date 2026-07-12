const STORAGE_KEY = "transitops-data-v1";
const SESSION_KEY = "transitops-session-v1";

const roles = {
  fleet: "Fleet Manager",
  driver: "Driver",
  safety: "Safety Officer",
  finance: "Financial Analyst"
};

const users = [
  {
    id: "user-fleet",
    name: "Riya Sharma",
    role: roles.fleet,
    email: "admin@transitops.io",
    password: "demo123"
  },
  {
    id: "user-driver",
    name: "Karan Mehta",
    role: roles.driver,
    email: "driver@transitops.io",
    password: "demo123"
  },
  {
    id: "user-safety",
    name: "Meera Rao",
    role: roles.safety,
    email: "safety@transitops.io",
    password: "demo123"
  },
  {
    id: "user-finance",
    name: "Arjun Iyer",
    role: roles.finance,
    email: "finance@transitops.io",
    password: "demo123"
  }
];

const views = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "DB",
    title: "Command Center",
    eyebrow: "Dashboard",
    roles: [roles.fleet, roles.driver, roles.safety, roles.finance]
  },
  {
    id: "vehicles",
    label: "Vehicles",
    icon: "VH",
    title: "Vehicle Registry",
    eyebrow: "Fleet master",
    roles: [roles.fleet]
  },
  {
    id: "drivers",
    label: "Drivers",
    icon: "DR",
    title: "Driver Management",
    eyebrow: "Compliance",
    roles: [roles.fleet, roles.safety]
  },
  {
    id: "trips",
    label: "Trips",
    icon: "TR",
    title: "Trip Management",
    eyebrow: "Dispatch",
    roles: [roles.fleet, roles.driver]
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: "MT",
    title: "Maintenance Log",
    eyebrow: "Workshop",
    roles: [roles.fleet, roles.safety]
  },
  {
    id: "expenses",
    label: "Expenses",
    icon: "EX",
    title: "Fuel & Expenses",
    eyebrow: "Costs",
    roles: [roles.fleet, roles.driver, roles.finance]
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "AN",
    title: "Reports & Analytics",
    eyebrow: "Insights",
    roles: [roles.fleet, roles.safety, roles.finance]
  },
  {
    id: "documents",
    label: "Documents",
    icon: "DC",
    title: "Vehicle Documents",
    eyebrow: "Bonus",
    roles: [roles.fleet, roles.safety]
  }
];

const seedData = {
  vehicles: [
    {
      id: "veh-van-05",
      registration: "KA-05-VN-0005",
      name: "Van-05",
      type: "Van",
      capacity: 500,
      odometer: 18750,
      acquisitionCost: 18000,
      status: "Available",
      region: "North",
      documentName: "Fitness Certificate",
      documentExpiry: "2026-08-18"
    },
    {
      id: "veh-truck-12",
      registration: "MH-12-TK-7788",
      name: "Truck-12",
      type: "Truck",
      capacity: 3200,
      odometer: 86420,
      acquisitionCost: 52000,
      status: "On Trip",
      region: "West",
      documentName: "Insurance",
      documentExpiry: "2027-01-20"
    },
    {
      id: "veh-reefer-02",
      registration: "DL-08-RF-4421",
      name: "Reefer-02",
      type: "Refrigerated",
      capacity: 1800,
      odometer: 54110,
      acquisitionCost: 61000,
      status: "In Shop",
      region: "North",
      documentName: "Pollution Certificate",
      documentExpiry: "2026-07-24"
    },
    {
      id: "veh-mini-09",
      registration: "TN-10-MN-0922",
      name: "Mini-09",
      type: "Mini Truck",
      capacity: 900,
      odometer: 31880,
      acquisitionCost: 26000,
      status: "Available",
      region: "South",
      documentName: "Insurance",
      documentExpiry: "2026-11-02"
    },
    {
      id: "veh-flat-07",
      registration: "GJ-01-FB-7007",
      name: "Flatbed-07",
      type: "Flatbed",
      capacity: 4200,
      odometer: 112900,
      acquisitionCost: 48000,
      status: "Retired",
      region: "West",
      documentName: "Fitness Certificate",
      documentExpiry: "2025-12-01"
    }
  ],
  drivers: [
    {
      id: "drv-alex",
      name: "Alex",
      licenseNumber: "DL-AX-9001",
      category: "LMV",
      licenseExpiry: "2027-06-12",
      contact: "+91 98765 01001",
      safetyScore: 94,
      status: "Available"
    },
    {
      id: "drv-priya",
      name: "Priya Nair",
      licenseNumber: "DL-PN-3391",
      category: "HMV",
      licenseExpiry: "2026-10-14",
      contact: "+91 98765 01002",
      safetyScore: 88,
      status: "On Trip"
    },
    {
      id: "drv-neha",
      name: "Neha Kapoor",
      licenseNumber: "DL-NK-1218",
      category: "LMV",
      licenseExpiry: "2026-07-22",
      contact: "+91 98765 01003",
      safetyScore: 91,
      status: "Available"
    },
    {
      id: "drv-omar",
      name: "Omar Khan",
      licenseNumber: "DL-OK-5555",
      category: "HMV",
      licenseExpiry: "2027-03-09",
      contact: "+91 98765 01004",
      safetyScore: 61,
      status: "Suspended"
    },
    {
      id: "drv-dev",
      name: "Dev Patel",
      licenseNumber: "DL-DP-8080",
      category: "LMV",
      licenseExpiry: "2025-12-28",
      contact: "+91 98765 01005",
      safetyScore: 73,
      status: "Off Duty"
    }
  ],
  trips: [
    {
      id: "trip-001",
      source: "Bengaluru Depot",
      destination: "Mysuru DC",
      vehicleId: "veh-van-05",
      driverId: "drv-alex",
      cargoWeight: 450,
      plannedDistance: 210,
      actualDistance: 214,
      revenue: 1240,
      status: "Completed",
      createdAt: "2026-07-03",
      dispatchedAt: "2026-07-04",
      completedAt: "2026-07-04",
      finalOdometer: 18750,
      fuelConsumed: 23,
      fuelCost: 1020
    },
    {
      id: "trip-002",
      source: "Mumbai Yard",
      destination: "Pune Hub",
      vehicleId: "veh-truck-12",
      driverId: "drv-priya",
      cargoWeight: 2400,
      plannedDistance: 155,
      actualDistance: 0,
      revenue: 1850,
      status: "Dispatched",
      createdAt: "2026-07-11",
      dispatchedAt: "2026-07-12",
      completedAt: "",
      finalOdometer: 0,
      fuelConsumed: 0,
      fuelCost: 0
    },
    {
      id: "trip-003",
      source: "Chennai Hub",
      destination: "Coimbatore DC",
      vehicleId: "veh-mini-09",
      driverId: "drv-neha",
      cargoWeight: 720,
      plannedDistance: 505,
      actualDistance: 0,
      revenue: 2120,
      status: "Draft",
      createdAt: "2026-07-12",
      dispatchedAt: "",
      completedAt: "",
      finalOdometer: 0,
      fuelConsumed: 0,
      fuelCost: 0
    }
  ],
  maintenance: [
    {
      id: "mnt-001",
      vehicleId: "veh-reefer-02",
      issue: "Cooling unit inspection",
      type: "Repair",
      cost: 620,
      startedAt: "2026-07-12",
      closedAt: "",
      status: "Active",
      notes: "Temperature drop reported by dispatch."
    },
    {
      id: "mnt-002",
      vehicleId: "veh-van-05",
      issue: "Oil change",
      type: "Service",
      cost: 210,
      startedAt: "2026-07-06",
      closedAt: "2026-07-06",
      status: "Closed",
      notes: "Scheduled service completed."
    }
  ],
  fuelLogs: [
    {
      id: "fuel-001",
      vehicleId: "veh-van-05",
      tripId: "trip-001",
      liters: 23,
      cost: 1020,
      date: "2026-07-04"
    }
  ],
  expenses: [
    {
      id: "exp-001",
      vehicleId: "veh-van-05",
      tripId: "trip-001",
      category: "Toll",
      amount: 85,
      date: "2026-07-04",
      notes: "Expressway toll"
    },
    {
      id: "exp-002",
      vehicleId: "veh-truck-12",
      tripId: "trip-002",
      category: "Permit",
      amount: 140,
      date: "2026-07-12",
      notes: "State permit"
    }
  ]
};

const state = {
  data: null,
  user: null,
  view: "dashboard",
  filters: {
    dashboardType: "All",
    dashboardStatus: "All",
    dashboardRegion: "All",
    vehicleSearch: "",
    vehicleStatus: "All",
    vehicleType: "All",
    vehicleRegion: "All",
    vehicleSort: "name",
    driverSearch: "",
    driverStatus: "All",
    tripStatus: "All",
    expenseVehicle: "All"
  }
};

const appRoot = document.querySelector("#appRoot");
const loginView = document.querySelector("#loginView");
const appShell = document.querySelector("#appShell");
const navList = document.querySelector("#navList");
const toastEl = document.querySelector("#toast");

document.addEventListener("DOMContentLoaded", init);

function init() {
  state.data = loadData();
  state.user = getSessionUser();
  bindChrome();
  renderDemoUsers();
  startClock();
  renderShell();
}

function bindChrome() {
  document.querySelector("#loginForm").addEventListener("submit", handleLogin);
  document.querySelector("#logoutButton").addEventListener("click", logout);
  document.querySelector("#resetDemo").addEventListener("click", resetDemo);
  document.querySelector("#themeToggle").addEventListener("click", toggleTheme);

  document.querySelector(".role-selector").addEventListener("click", (event) => {
    const button = event.target.closest("[data-demo-email]");
    if (!button) return;
    document.querySelectorAll(".role-selector button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelector("#loginEmail").value = button.dataset.demoEmail;
    document.querySelector("#loginPassword").value = "demo123";
  });

  navList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-view]");
    if (!button) return;
    state.view = button.dataset.view;
    renderShell();
  });

  appRoot.addEventListener("submit", handleSubmit);
  appRoot.addEventListener("click", handleClick);
  appRoot.addEventListener("input", handleInput);
  appRoot.addEventListener("change", handleInput);

  const savedTheme = localStorage.getItem("transitops-theme");
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
}

function renderShell() {
  if (!state.user) {
    loginView.classList.remove("hidden");
    appShell.classList.add("hidden");
    return;
  }

  loginView.classList.add("hidden");
  appShell.classList.remove("hidden");

  const availableViews = views.filter((view) => view.roles.includes(state.user.role));
  if (!availableViews.some((view) => view.id === state.view)) {
    state.view = availableViews[0].id;
  }

  document.querySelector("#sessionRole").textContent = state.user.role;
  document.querySelector("#sessionName").textContent = state.user.name;

  navList.innerHTML = availableViews.map((view) => `
    <button class="nav-item ${view.id === state.view ? "active" : ""}" type="button" data-view="${view.id}">
      <span class="nav-icon">${view.icon}</span>
      <span>${view.label}</span>
    </button>
  `).join("");

  const activeView = views.find((view) => view.id === state.view);
  document.querySelector("#viewEyebrow").textContent = activeView.eyebrow;
  document.querySelector("#viewTitle").textContent = activeView.title;

  renderView();
}

function startClock() {
  const clock = document.querySelector("#commandClock");
  if (!clock) return;

  const tick = () => {
    clock.textContent = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(new Date());
  };

  tick();
  setInterval(tick, 1000);
}

function renderView() {
  const renderers = {
    dashboard: renderDashboard,
    vehicles: renderVehicles,
    drivers: renderDrivers,
    trips: renderTrips,
    maintenance: renderMaintenance,
    expenses: renderExpenses,
    analytics: renderAnalytics,
    documents: renderDocuments
  };

  appRoot.innerHTML = renderers[state.view]();
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.querySelector("#loginEmail").value.trim().toLowerCase();
  const password = document.querySelector("#loginPassword").value;
  const user = users.find((item) => item.email === email && item.password === password);

  if (!user) {
    showToast("Invalid email or password.");
    return;
  }

  localStorage.setItem(SESSION_KEY, user.id);
  state.user = user;
  state.view = "dashboard";
  showToast(`Signed in as ${user.role}.`);
  renderShell();
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  state.user = null;
  renderShell();
}

function resetDemo() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
  state.data = clone(seedData);
  showToast("Demo data reset.");
  renderShell();
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "" : "dark";
  if (next) {
    document.documentElement.dataset.theme = next;
    localStorage.setItem("transitops-theme", next);
  } else {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("transitops-theme");
  }
}

function renderDemoUsers() {
  document.querySelector("#demoUserList").innerHTML = users.map((user) => `
    <button class="demo-user" type="button" data-demo-email="${user.email}">
      <strong>${escapeHtml(user.role)}</strong>
      <span>${escapeHtml(user.email)}</span>
    </button>
  `).join("");

  document.querySelector("#demoUserList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-demo-email]");
    if (!button) return;
    document.querySelector("#loginEmail").value = button.dataset.demoEmail;
    document.querySelector("#loginPassword").value = "demo123";
  });
}

function renderDashboard() {
  const scoped = getFilteredVehiclesForDashboard();
  const metrics = computeMetrics(scoped);
  const licenseAlerts = getLicenseAlerts();
  const activeTrips = state.data.trips.filter((trip) => trip.status === "Dispatched");
  const pendingTrips = state.data.trips.filter((trip) => trip.status === "Draft");

  return `
    <section class="metric-grid">
      ${metricCard("Active Vehicles", metrics.activeVehicles, "Available, on trip, or in shop", "accent")}
      ${metricCard("Available Vehicles", metrics.availableVehicles, "Ready for dispatch", "")}
      ${metricCard("Vehicles in Maintenance", metrics.inShopVehicles, "Hidden from trip selection", "amber")}
      ${metricCard("Fleet Utilization", `${metrics.utilization}%`, "On-trip share of active fleet", "violet")}
      ${metricCard("Active Trips", activeTrips.length, "Currently dispatched", "")}
      ${metricCard("Pending Trips", pendingTrips.length, "Draft trips waiting", "amber")}
      ${metricCard("Drivers On Duty", metrics.driversOnDuty, "Available or on trip", "accent")}
      ${metricCard("Compliance Alerts", licenseAlerts.length, "Licenses expiring or expired", "amber")}
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>Operational Filters</h3>
          <p>KPIs respond to fleet type, vehicle status, and region.</p>
        </div>
      </div>
      <div class="panel-body filters">
        ${selectField("Vehicle type", "dashboardType", ["All", ...unique(state.data.vehicles.map((v) => v.type))], state.filters.dashboardType)}
        ${selectField("Status", "dashboardStatus", ["All", "Available", "On Trip", "In Shop", "Retired"], state.filters.dashboardStatus)}
        ${selectField("Region", "dashboardRegion", ["All", ...unique(state.data.vehicles.map((v) => v.region))], state.filters.dashboardRegion)}
        <label>
          Data window
          <select disabled>
            <option>Current month</option>
          </select>
        </label>
      </div>
    </section>

    <section class="grid-2">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h3>Fleet Utilization</h3>
            <p>Retired vehicles are excluded from utilization.</p>
          </div>
        </div>
        <div class="panel-body donut-wrap">
          <div class="donut" style="--utilization: ${metrics.utilization}%;" data-label="${metrics.utilization}%"></div>
          <ul class="insight-list">
            <li><strong>${metrics.onTripVehicles} vehicles on trip</strong><span>${metrics.availableVehicles} available and ${metrics.inShopVehicles} in shop.</span></li>
            <li><strong>${formatCurrency(metrics.operationalCost)} operational cost</strong><span>Fuel plus maintenance recorded in the platform.</span></li>
            <li><strong>${metrics.bestEfficiency}</strong><span>Best current fuel efficiency.</span></li>
          </ul>
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h3>License Watch</h3>
            <p>Safety officer queue for compliance follow-up.</p>
          </div>
        </div>
        <div class="panel-body">
          ${licenseAlerts.length ? `
            <ul class="insight-list">
              ${licenseAlerts.slice(0, 4).map((driver) => `
                <li>
                  <strong>${escapeHtml(driver.name)} ${statusPill(driver.licenseState)}</strong>
                  <span>${escapeHtml(driver.licenseNumber)} expires ${formatDate(driver.licenseExpiry)}</span>
                </li>
              `).join("")}
            </ul>
          ` : `<div class="empty-state"><strong>No compliance alerts</strong><span>All driver licenses are valid beyond 30 days.</span></div>`}
        </div>
      </article>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>Hackathon Workflow</h3>
          <p>Core business rules are wired into each step.</p>
        </div>
      </div>
      <div class="panel-body workflow-strip">
        ${workflowStep("01", "Register vehicle and driver")}
        ${workflowStep("02", "Create trip with cargo validation")}
        ${workflowStep("03", "Dispatch changes both statuses")}
        ${workflowStep("04", "Complete trip with fuel log")}
        ${workflowStep("05", "Maintenance hides vehicle")}
      </div>
    </section>
  `;
}

function renderVehicles() {
  const filtered = getFilteredVehicles();
  const rows = filtered.map((vehicle) => `
    <tr>
      <td><strong>${escapeHtml(vehicle.name)}</strong><br><span class="muted">${escapeHtml(vehicle.registration)}</span></td>
      <td>${escapeHtml(vehicle.type)}</td>
      <td>${formatNumber(vehicle.capacity)} kg</td>
      <td>${formatNumber(vehicle.odometer)} km</td>
      <td>${formatCurrency(vehicle.acquisitionCost)}</td>
      <td>${escapeHtml(vehicle.region)}</td>
      <td>${statusPill(vehicle.status)}</td>
      <td>${escapeHtml(vehicle.documentName)}<br><span class="muted">${formatDate(vehicle.documentExpiry)}</span></td>
      <td>
        <div class="table-actions">
          ${vehicle.status !== "Retired" ? `<button class="table-action" type="button" data-retire-vehicle="${vehicle.id}">Retire</button>` : ""}
          ${vehicle.status === "Retired" ? `<button class="table-action" type="button" data-restore-vehicle="${vehicle.id}">Restore</button>` : ""}
          <button class="table-action" type="button" data-delete-vehicle="${vehicle.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");

  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>Add Vehicle</h3>
          <p>Registration number is checked for uniqueness before save.</p>
        </div>
      </div>
      <form id="vehicleForm" class="panel-body form-grid">
        <label>Registration Number<input name="registration" placeholder="KA-05-VN-0005" required /></label>
        <label>Vehicle Name / Model<input name="name" placeholder="Van-05" required /></label>
        <label>Type<input name="type" placeholder="Van, Truck, Reefer" required /></label>
        <label>Region<input name="region" placeholder="North" required /></label>
        <label>Maximum Load Capacity (kg)<input name="capacity" type="number" min="1" step="1" required /></label>
        <label>Odometer (km)<input name="odometer" type="number" min="0" step="1" required /></label>
        <label>Acquisition Cost<input name="acquisitionCost" type="number" min="0" step="1" required /></label>
        ${selectField("Status", "status", ["Available", "On Trip", "In Shop", "Retired"], "Available", false)}
        <label class="wide">Document Name<input name="documentName" placeholder="Fitness Certificate" /></label>
        <label>Document Expiry<input name="documentExpiry" type="date" /></label>
        <div class="action-row full">
          <button class="primary-action" type="submit">Save vehicle</button>
          <button class="secondary-action" type="button" data-export="vehicles">Export CSV</button>
        </div>
      </form>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>Vehicle Registry</h3>
          <p>${filtered.length} of ${state.data.vehicles.length} vehicles shown.</p>
        </div>
      </div>
      <div class="panel-body">
        <div class="filters">
          <label>Search<input data-filter="vehicleSearch" value="${escapeAttr(state.filters.vehicleSearch)}" placeholder="Name or registration" /></label>
          ${selectField("Status", "vehicleStatus", ["All", "Available", "On Trip", "In Shop", "Retired"], state.filters.vehicleStatus)}
          ${selectField("Type", "vehicleType", ["All", ...unique(state.data.vehicles.map((v) => v.type))], state.filters.vehicleType)}
          ${selectField("Sort", "vehicleSort", ["name", "capacity", "odometer", "status"], state.filters.vehicleSort)}
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Odometer</th>
              <th>Cost</th>
              <th>Region</th>
              <th>Status</th>
              <th>Document</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${rows || emptyRow(9, "No vehicles match the selected filters.")}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderDrivers() {
  const filtered = getFilteredDrivers();
  const rows = filtered.map((driver) => {
    const licenseState = getLicenseState(driver);
    return `
      <tr>
        <td><strong>${escapeHtml(driver.name)}</strong><br><span class="muted">${escapeHtml(driver.contact)}</span></td>
        <td>${escapeHtml(driver.licenseNumber)}</td>
        <td>${escapeHtml(driver.category)}</td>
        <td>${formatDate(driver.licenseExpiry)}<br>${statusPill(licenseState)}</td>
        <td>${driver.safetyScore}/100</td>
        <td>${statusPill(driver.status)}</td>
        <td>
          <div class="table-actions">
            ${driver.status !== "Suspended" ? `<button class="table-action" type="button" data-suspend-driver="${driver.id}">Suspend</button>` : ""}
            ${driver.status === "Suspended" || driver.status === "Off Duty" ? `<button class="table-action" type="button" data-restore-driver="${driver.id}">Available</button>` : ""}
            ${(licenseState === "Expiring" || licenseState === "Expired") ? `<button class="table-action" type="button" data-remind-driver="${driver.id}">Reminder</button>` : ""}
            <button class="table-action" type="button" data-delete-driver="${driver.id}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>Add Driver</h3>
          <p>Expired licenses and suspended drivers are blocked from dispatch.</p>
        </div>
      </div>
      <form id="driverForm" class="panel-body form-grid">
        <label>Name<input name="name" placeholder="Alex" required /></label>
        <label>License Number<input name="licenseNumber" placeholder="DL-AX-9001" required /></label>
        <label>License Category<input name="category" placeholder="LMV / HMV" required /></label>
        <label>License Expiry<input name="licenseExpiry" type="date" required /></label>
        <label>Contact Number<input name="contact" placeholder="+91 98765 00000" required /></label>
        <label>Safety Score<input name="safetyScore" type="number" min="0" max="100" step="1" required /></label>
        ${selectField("Status", "status", ["Available", "On Trip", "Off Duty", "Suspended"], "Available", false)}
        <div class="action-row full">
          <button class="primary-action" type="submit">Save driver</button>
          <button class="secondary-action" type="button" data-export="drivers">Export CSV</button>
        </div>
      </form>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>Driver Profiles</h3>
          <p>${filtered.length} of ${state.data.drivers.length} drivers shown.</p>
        </div>
      </div>
      <div class="panel-body filters">
        <label>Search<input data-filter="driverSearch" value="${escapeAttr(state.filters.driverSearch)}" placeholder="Name or license" /></label>
        ${selectField("Status", "driverStatus", ["All", "Available", "On Trip", "Off Duty", "Suspended"], state.filters.driverStatus)}
        <label>Compliance<select disabled><option>All licenses</option></select></label>
        <label>Sort<select disabled><option>Safety score</option></select></label>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Driver</th>
              <th>License</th>
              <th>Category</th>
              <th>Expiry</th>
              <th>Safety</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${rows || emptyRow(7, "No drivers match the selected filters.")}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderTrips() {
  const trips = state.data.trips.filter((trip) => state.filters.tripStatus === "All" || trip.status === state.filters.tripStatus);
  const selectedVehicle = state.data.vehicles.find((v) => v.id === (state.data.vehicles.find((v) => v.status === "Available") || {}).id);
  const selectedDriver = state.data.drivers.find((d) => d.id === (state.data.drivers.find((d) => canDriverDispatch(d)) || {}).id);
  const checks = selectedVehicle && selectedDriver ? validateTrip({
    vehicleId: selectedVehicle.id,
    driverId: selectedDriver.id,
    cargoWeight: Math.min(450, selectedVehicle.capacity)
  }) : [];

  const rows = trips.map((trip) => {
    const vehicle = getVehicle(trip.vehicleId);
    const driver = getDriver(trip.driverId);
    return `
      <tr>
        <td><strong>${escapeHtml(trip.source)}</strong><br><span class="muted">to ${escapeHtml(trip.destination)}</span></td>
        <td>${escapeHtml(vehicle?.name || "Missing")}</td>
        <td>${escapeHtml(driver?.name || "Missing")}</td>
        <td>${formatNumber(trip.cargoWeight)} kg</td>
        <td>${formatNumber(trip.plannedDistance)} km</td>
        <td>${formatCurrency(trip.revenue)}</td>
        <td>${statusPill(trip.status)}</td>
        <td>
          <div class="table-actions">
            ${trip.status === "Draft" ? `<button class="table-action" type="button" data-dispatch-trip="${trip.id}">Dispatch</button>` : ""}
            ${trip.status === "Dispatched" ? `<button class="table-action" type="button" data-complete-trip="${trip.id}">Complete</button>` : ""}
            ${trip.status === "Draft" || trip.status === "Dispatched" ? `<button class="table-action" type="button" data-cancel-trip="${trip.id}">Cancel</button>` : ""}
          </div>
        </td>
      </tr>
    `;
  }).join("");

  return `
    <section class="grid-2">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h3>Create Trip</h3>
            <p>Dispatch runs capacity, license, status, and double-booking rules.</p>
          </div>
        </div>
        <form id="tripForm" class="panel-body form-grid">
          <label class="wide">Source<input name="source" placeholder="Depot" required /></label>
          <label class="wide">Destination<input name="destination" placeholder="Distribution Center" required /></label>
          ${selectEntityField("Available Vehicle", "vehicleId", getDispatchableVehicles(), "name", "registration")}
          ${selectEntityField("Available Driver", "driverId", getDispatchableDrivers(), "name", "licenseNumber")}
          <label>Cargo Weight (kg)<input name="cargoWeight" type="number" min="1" step="1" value="${selectedVehicle ? Math.min(450, selectedVehicle.capacity) : ""}" required /></label>
          <label>Planned Distance (km)<input name="plannedDistance" type="number" min="1" step="1" value="210" required /></label>
          <label>Expected Revenue<input name="revenue" type="number" min="0" step="1" value="1200" required /></label>
          <div class="action-row full">
            <button class="secondary-action" type="submit" data-action="draft">Create draft</button>
            <button class="primary-action" type="submit" data-action="dispatch">Create & dispatch</button>
          </div>
        </form>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h3>Rule Preview</h3>
            <p>Sample dispatch checks for the next available vehicle and driver.</p>
          </div>
        </div>
        <div class="panel-body">
          ${checks.length ? renderValidationList(checks) : `<div class="empty-state"><strong>No dispatch pair available</strong><span>Free a vehicle and a compliant driver to dispatch.</span></div>`}
        </div>
      </article>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>Trips</h3>
          <p>${trips.length} of ${state.data.trips.length} trips shown.</p>
        </div>
        <div class="toolbar">
          ${selectField("Status", "tripStatus", ["All", "Draft", "Dispatched", "Completed", "Cancelled"], state.filters.tripStatus)}
          <button class="secondary-action" type="button" data-export="trips">Export CSV</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Route</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Cargo</th>
              <th>Distance</th>
              <th>Revenue</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${rows || emptyRow(8, "No trips match the selected status.")}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderMaintenance() {
  const rows = state.data.maintenance.map((item) => {
    const vehicle = getVehicle(item.vehicleId);
    return `
      <tr>
        <td><strong>${escapeHtml(vehicle?.name || "Missing")}</strong><br><span class="muted">${escapeHtml(vehicle?.registration || "")}</span></td>
        <td>${escapeHtml(item.type)}</td>
        <td>${escapeHtml(item.issue)}</td>
        <td>${formatCurrency(item.cost)}</td>
        <td>${formatDate(item.startedAt)}</td>
        <td>${item.closedAt ? formatDate(item.closedAt) : "-"}</td>
        <td>${statusPill(item.status)}</td>
        <td>
          <div class="table-actions">
            ${item.status === "Active" ? `<button class="table-action" type="button" data-close-maintenance="${item.id}">Close</button>` : ""}
          </div>
        </td>
      </tr>
    `;
  }).join("");

  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>Create Maintenance Record</h3>
          <p>Active maintenance automatically moves the vehicle to In Shop.</p>
        </div>
      </div>
      <form id="maintenanceForm" class="panel-body form-grid">
        ${selectEntityField("Vehicle", "vehicleId", state.data.vehicles.filter((v) => v.status !== "Retired"), "name", "registration")}
        ${selectField("Type", "type", ["Service", "Repair", "Inspection", "Tyre", "Body"], "Service", false)}
        <label class="wide">Issue<input name="issue" placeholder="Oil change" required /></label>
        <label>Cost<input name="cost" type="number" min="0" step="1" required /></label>
        <label>Start Date<input name="startedAt" type="date" value="${todayIso()}" required /></label>
        <label class="full">Notes<textarea name="notes" placeholder="Maintenance notes"></textarea></label>
        <div class="action-row full">
          <button class="primary-action" type="submit">Create active record</button>
          <button class="secondary-action" type="button" data-export="maintenance">Export CSV</button>
        </div>
      </form>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>Maintenance Logs</h3>
          <p>${state.data.maintenance.filter((m) => m.status === "Active").length} active records.</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Type</th>
              <th>Issue</th>
              <th>Cost</th>
              <th>Started</th>
              <th>Closed</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${rows || emptyRow(8, "No maintenance records yet.")}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderExpenses() {
  const vehicleOptions = ["All", ...state.data.vehicles.map((vehicle) => vehicle.id)];
  const filteredFuel = state.data.fuelLogs.filter((log) => state.filters.expenseVehicle === "All" || log.vehicleId === state.filters.expenseVehicle);
  const filteredExpenses = state.data.expenses.filter((expense) => state.filters.expenseVehicle === "All" || expense.vehicleId === state.filters.expenseVehicle);

  return `
    <section class="grid-2">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h3>Fuel Log</h3>
            <p>Fuel entries power efficiency and operating-cost reports.</p>
          </div>
        </div>
        <form id="fuelForm" class="panel-body form-grid">
          ${selectEntityField("Vehicle", "vehicleId", state.data.vehicles.filter((v) => v.status !== "Retired"), "name", "registration")}
          ${selectEntityField("Trip", "tripId", state.data.trips, "source", "status", true)}
          <label>Liters<input name="liters" type="number" min="0.1" step="0.1" required /></label>
          <label>Cost<input name="cost" type="number" min="0" step="1" required /></label>
          <label>Date<input name="date" type="date" value="${todayIso()}" required /></label>
          <div class="action-row full">
            <button class="primary-action" type="submit">Record fuel</button>
          </div>
        </form>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h3>Other Expense</h3>
            <p>Tolls, permits, repairs, and ad hoc operational costs.</p>
          </div>
        </div>
        <form id="expenseForm" class="panel-body form-grid">
          ${selectEntityField("Vehicle", "vehicleId", state.data.vehicles, "name", "registration")}
          ${selectField("Category", "category", ["Toll", "Permit", "Maintenance", "Parking", "Fine", "Other"], "Toll", false)}
          <label>Amount<input name="amount" type="number" min="0" step="1" required /></label>
          <label>Date<input name="date" type="date" value="${todayIso()}" required /></label>
          <label class="full">Notes<textarea name="notes" placeholder="Expense notes"></textarea></label>
          <div class="action-row full">
            <button class="primary-action" type="submit">Record expense</button>
            <button class="secondary-action" type="button" data-export="expenses">Export CSV</button>
          </div>
        </form>
      </article>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>Cost Ledger</h3>
          <p>${filteredFuel.length} fuel logs and ${filteredExpenses.length} expenses shown.</p>
        </div>
        <div class="toolbar">
          ${selectVehicleFilter("Vehicle", "expenseVehicle", vehicleOptions, state.filters.expenseVehicle)}
        </div>
      </div>
      <div class="grid-2 panel-body">
        ${ledgerTable("Fuel Logs", filteredFuel.map((log) => ({
          vehicle: getVehicle(log.vehicleId)?.name || "Missing",
          detail: getTrip(log.tripId)?.destination || "Manual log",
          date: log.date,
          amount: log.cost,
          meta: `${formatNumber(log.liters)} L`
        })))}
        ${ledgerTable("Expenses", filteredExpenses.map((expense) => ({
          vehicle: getVehicle(expense.vehicleId)?.name || "Missing",
          detail: expense.category,
          date: expense.date,
          amount: expense.amount,
          meta: expense.notes
        })))}
      </div>
    </section>
  `;
}

function renderAnalytics() {
  const rows = state.data.vehicles.map((vehicle) => {
    const analysis = vehicleAnalysis(vehicle.id);
    return `
      <tr>
        <td><strong>${escapeHtml(vehicle.name)}</strong><br><span class="muted">${escapeHtml(vehicle.registration)}</span></td>
        <td>${analysis.distance ? `${formatNumber(analysis.distance)} km` : "-"}</td>
        <td>${analysis.fuel ? `${formatNumber(analysis.fuel)} L` : "-"}</td>
        <td>${analysis.efficiency ? `${analysis.efficiency.toFixed(1)} km/L` : "-"}</td>
        <td>${formatCurrency(analysis.operationalCost)}</td>
        <td>${formatCurrency(analysis.revenue)}</td>
        <td>${analysis.roi.toFixed(2)}%</td>
      </tr>
    `;
  }).join("");

  const costBars = state.data.vehicles.map((vehicle) => {
    const analysis = vehicleAnalysis(vehicle.id);
    return {
      label: vehicle.name,
      value: analysis.operationalCost
    };
  });

  const efficiencyBars = state.data.vehicles.map((vehicle) => {
    const analysis = vehicleAnalysis(vehicle.id);
    return {
      label: vehicle.name,
      value: Number(analysis.efficiency.toFixed(1))
    };
  });

  return `
    <section class="grid-2">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h3>Operational Cost</h3>
            <p>Fuel plus maintenance cost per vehicle.</p>
          </div>
        </div>
        <div class="panel-body">
          ${barChart(costBars, formatCurrency)}
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h3>Fuel Efficiency</h3>
            <p>Completed-trip distance divided by logged fuel.</p>
          </div>
        </div>
        <div class="panel-body">
          ${barChart(efficiencyBars, (value) => `${value} km/L`)}
        </div>
      </article>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>Vehicle ROI Report</h3>
          <p>ROI = (Revenue - Maintenance - Fuel) / Acquisition Cost.</p>
        </div>
        <div class="toolbar">
          <button class="secondary-action" type="button" data-export="analytics">Export CSV</button>
          <button class="primary-action" type="button" data-print-report>PDF export</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Distance</th>
              <th>Fuel</th>
              <th>Efficiency</th>
              <th>Operational Cost</th>
              <th>Revenue</th>
              <th>ROI</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderDocuments() {
  const expiringDocs = state.data.vehicles.filter((vehicle) => daysUntil(vehicle.documentExpiry) <= 45);
  const rows = state.data.vehicles.map((vehicle) => {
    const days = daysUntil(vehicle.documentExpiry);
    const stateLabel = days < 0 ? "Expired" : days <= 45 ? "Expiring" : "Valid";
    return `
      <tr>
        <td><strong>${escapeHtml(vehicle.name)}</strong><br><span class="muted">${escapeHtml(vehicle.registration)}</span></td>
        <td>${escapeHtml(vehicle.documentName || "-")}</td>
        <td>${vehicle.documentExpiry ? formatDate(vehicle.documentExpiry) : "-"}</td>
        <td>${statusPill(stateLabel)}</td>
        <td>
          <div class="table-actions">
            ${stateLabel !== "Valid" ? `<button class="table-action" type="button" data-remind-document="${vehicle.id}">Reminder</button>` : ""}
          </div>
        </td>
      </tr>
    `;
  }).join("");

  return `
    <section class="grid-2">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h3>Update Document</h3>
            <p>Vehicle document metadata is tracked with expiry alerts.</p>
          </div>
        </div>
        <form id="documentForm" class="panel-body form-grid">
          ${selectEntityField("Vehicle", "vehicleId", state.data.vehicles, "name", "registration")}
          <label>Document Name<input name="documentName" placeholder="Insurance" required /></label>
          <label>Expiry Date<input name="documentExpiry" type="date" required /></label>
          <div class="action-row full">
            <button class="primary-action" type="submit">Update document</button>
          </div>
        </form>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h3>Renewal Queue</h3>
            <p>${expiringDocs.length} documents expire within 45 days or are already expired.</p>
          </div>
        </div>
        <div class="panel-body">
          ${expiringDocs.length ? `
            <ul class="insight-list">
              ${expiringDocs.map((vehicle) => `
                <li>
                  <strong>${escapeHtml(vehicle.name)} ${statusPill(daysUntil(vehicle.documentExpiry) < 0 ? "Expired" : "Expiring")}</strong>
                  <span>${escapeHtml(vehicle.documentName)} expires ${formatDate(vehicle.documentExpiry)}</span>
                </li>
              `).join("")}
            </ul>
          ` : `<div class="empty-state"><strong>No document alerts</strong><span>All vehicle documents are current.</span></div>`}
        </div>
      </article>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>Document Registry</h3>
          <p>Bonus feature for inspection and insurance compliance.</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Document</th>
              <th>Expiry</th>
              <th>State</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = Object.fromEntries(new FormData(form).entries());

  if (form.id === "vehicleForm") addVehicle(data, form);
  if (form.id === "driverForm") addDriver(data, form);
  if (form.id === "tripForm") addTrip(data, event.submitter?.dataset.action || "draft", form);
  if (form.id === "maintenanceForm") addMaintenance(data, form);
  if (form.id === "fuelForm") addFuelLog(data, form);
  if (form.id === "expenseForm") addExpense(data, form);
  if (form.id === "documentForm") updateDocument(data, form);
}

function handleClick(event) {
  const target = event.target.closest("button");
  if (!target) return;

  if (target.dataset.retireVehicle) setVehicleStatus(target.dataset.retireVehicle, "Retired");
  if (target.dataset.restoreVehicle) setVehicleStatus(target.dataset.restoreVehicle, "Available");
  if (target.dataset.deleteVehicle) deleteVehicle(target.dataset.deleteVehicle);
  if (target.dataset.suspendDriver) setDriverStatus(target.dataset.suspendDriver, "Suspended");
  if (target.dataset.restoreDriver) setDriverStatus(target.dataset.restoreDriver, "Available");
  if (target.dataset.deleteDriver) deleteDriver(target.dataset.deleteDriver);
  if (target.dataset.remindDriver) remindDriver(target.dataset.remindDriver);
  if (target.dataset.dispatchTrip) dispatchTrip(target.dataset.dispatchTrip);
  if (target.dataset.completeTrip) completeTrip(target.dataset.completeTrip);
  if (target.dataset.cancelTrip) cancelTrip(target.dataset.cancelTrip);
  if (target.dataset.closeMaintenance) closeMaintenance(target.dataset.closeMaintenance);
  if (target.dataset.export) exportData(target.dataset.export);
  if (target.dataset.printReport !== undefined) window.print();
  if (target.dataset.remindDocument) remindDocument(target.dataset.remindDocument);
}

function handleInput(event) {
  const filterName = event.target.dataset.filter || event.target.name;
  if (!filterName || !(filterName in state.filters)) return;
  state.filters[filterName] = event.target.value;
  renderView();
}

function addVehicle(formData, form) {
  const registration = formData.registration.trim().toUpperCase();
  const exists = state.data.vehicles.some((vehicle) => vehicle.registration.toUpperCase() === registration);
  if (exists) {
    showToast("Vehicle registration number must be unique.");
    return;
  }

  state.data.vehicles.push({
    id: id("veh"),
    registration,
    name: formData.name.trim(),
    type: formData.type.trim(),
    capacity: Number(formData.capacity),
    odometer: Number(formData.odometer),
    acquisitionCost: Number(formData.acquisitionCost),
    status: formData.status,
    region: formData.region.trim(),
    documentName: formData.documentName.trim() || "Not uploaded",
    documentExpiry: formData.documentExpiry || ""
  });

  persist("Vehicle saved.");
  form.reset();
  renderShell();
}

function addDriver(formData, form) {
  const exists = state.data.drivers.some((driver) => driver.licenseNumber.toUpperCase() === formData.licenseNumber.trim().toUpperCase());
  if (exists) {
    showToast("Driver license number must be unique.");
    return;
  }

  state.data.drivers.push({
    id: id("drv"),
    name: formData.name.trim(),
    licenseNumber: formData.licenseNumber.trim().toUpperCase(),
    category: formData.category.trim().toUpperCase(),
    licenseExpiry: formData.licenseExpiry,
    contact: formData.contact.trim(),
    safetyScore: Number(formData.safetyScore),
    status: formData.status
  });

  persist("Driver saved.");
  form.reset();
  renderShell();
}

function addTrip(formData, action, form) {
  const payload = {
    vehicleId: formData.vehicleId,
    driverId: formData.driverId,
    cargoWeight: Number(formData.cargoWeight)
  };
  const checks = validateTrip(payload);
  const blocked = checks.filter((check) => !check.ok);

  if (blocked.length) {
    showToast(blocked[0].message);
    return;
  }

  const trip = {
    id: id("trip"),
    source: formData.source.trim(),
    destination: formData.destination.trim(),
    vehicleId: formData.vehicleId,
    driverId: formData.driverId,
    cargoWeight: Number(formData.cargoWeight),
    plannedDistance: Number(formData.plannedDistance),
    actualDistance: 0,
    revenue: Number(formData.revenue),
    status: "Draft",
    createdAt: todayIso(),
    dispatchedAt: "",
    completedAt: "",
    finalOdometer: 0,
    fuelConsumed: 0,
    fuelCost: 0
  };

  state.data.trips.push(trip);
  if (action === "dispatch") {
    dispatchTrip(trip.id, true);
  } else {
    persist("Trip draft created.");
  }

  form.reset();
  renderShell();
}

function dispatchTrip(tripId, silent = false) {
  const trip = getTrip(tripId);
  if (!trip || trip.status !== "Draft") return;

  const checks = validateTrip({
    vehicleId: trip.vehicleId,
    driverId: trip.driverId,
    cargoWeight: trip.cargoWeight
  });
  const blocked = checks.filter((check) => !check.ok);
  if (blocked.length) {
    showToast(blocked[0].message);
    return;
  }

  trip.status = "Dispatched";
  trip.dispatchedAt = todayIso();
  getVehicle(trip.vehicleId).status = "On Trip";
  getDriver(trip.driverId).status = "On Trip";
  persist(silent ? "Trip created and dispatched." : "Trip dispatched.");
  renderShell();
}

function completeTrip(tripId) {
  const trip = getTrip(tripId);
  if (!trip || trip.status !== "Dispatched") return;
  const vehicle = getVehicle(trip.vehicleId);
  const driver = getDriver(trip.driverId);

  const actualDistance = promptNumber("Actual distance in km", trip.plannedDistance);
  if (actualDistance === null) return;
  const finalOdometer = promptNumber("Final odometer", vehicle.odometer + actualDistance);
  if (finalOdometer === null) return;
  const fuelConsumed = promptNumber("Fuel consumed in liters", Math.max(1, Math.round(actualDistance / 9)));
  if (fuelConsumed === null) return;
  const fuelCost = promptNumber("Fuel cost", Math.round(fuelConsumed * 96));
  if (fuelCost === null) return;

  trip.status = "Completed";
  trip.completedAt = todayIso();
  trip.actualDistance = actualDistance;
  trip.finalOdometer = finalOdometer;
  trip.fuelConsumed = fuelConsumed;
  trip.fuelCost = fuelCost;
  vehicle.odometer = Math.max(vehicle.odometer, finalOdometer);
  vehicle.status = "Available";
  driver.status = "Available";

  state.data.fuelLogs.push({
    id: id("fuel"),
    vehicleId: trip.vehicleId,
    tripId: trip.id,
    liters: fuelConsumed,
    cost: fuelCost,
    date: todayIso()
  });

  persist("Trip completed. Vehicle and driver are available again.");
  renderShell();
}

function cancelTrip(tripId) {
  const trip = getTrip(tripId);
  if (!trip || !["Draft", "Dispatched"].includes(trip.status)) return;

  if (trip.status === "Dispatched") {
    const vehicle = getVehicle(trip.vehicleId);
    const driver = getDriver(trip.driverId);
    if (vehicle && vehicle.status !== "Retired") vehicle.status = "Available";
    if (driver && driver.status !== "Suspended") driver.status = "Available";
  }

  trip.status = "Cancelled";
  persist("Trip cancelled. Assigned resources were restored.");
  renderShell();
}

function addMaintenance(formData, form) {
  const vehicle = getVehicle(formData.vehicleId);
  if (!vehicle) return;
  if (vehicle.status === "On Trip") {
    showToast("Vehicle on trip cannot enter maintenance.");
    return;
  }
  if (vehicle.status === "Retired") {
    showToast("Retired vehicles cannot be sent to maintenance.");
    return;
  }

  state.data.maintenance.push({
    id: id("mnt"),
    vehicleId: formData.vehicleId,
    issue: formData.issue.trim(),
    type: formData.type,
    cost: Number(formData.cost),
    startedAt: formData.startedAt,
    closedAt: "",
    status: "Active",
    notes: formData.notes.trim()
  });
  vehicle.status = "In Shop";

  persist("Maintenance opened. Vehicle moved to In Shop.");
  form.reset();
  renderShell();
}

function closeMaintenance(maintenanceId) {
  const item = state.data.maintenance.find((entry) => entry.id === maintenanceId);
  if (!item || item.status !== "Active") return;
  const vehicle = getVehicle(item.vehicleId);

  item.status = "Closed";
  item.closedAt = todayIso();
  if (vehicle && vehicle.status !== "Retired") {
    vehicle.status = "Available";
  }

  persist("Maintenance closed. Vehicle restored to Available.");
  renderShell();
}

function addFuelLog(formData, form) {
  state.data.fuelLogs.push({
    id: id("fuel"),
    vehicleId: formData.vehicleId,
    tripId: formData.tripId,
    liters: Number(formData.liters),
    cost: Number(formData.cost),
    date: formData.date
  });

  persist("Fuel log recorded.");
  form.reset();
  renderShell();
}

function addExpense(formData, form) {
  state.data.expenses.push({
    id: id("exp"),
    vehicleId: formData.vehicleId,
    tripId: "",
    category: formData.category,
    amount: Number(formData.amount),
    date: formData.date,
    notes: formData.notes.trim()
  });

  persist("Expense recorded.");
  form.reset();
  renderShell();
}

function updateDocument(formData, form) {
  const vehicle = getVehicle(formData.vehicleId);
  if (!vehicle) return;
  vehicle.documentName = formData.documentName.trim();
  vehicle.documentExpiry = formData.documentExpiry;
  persist("Vehicle document updated.");
  form.reset();
  renderShell();
}

function setVehicleStatus(vehicleId, status) {
  const vehicle = getVehicle(vehicleId);
  if (!vehicle) return;
  if (status === "Retired" && vehicle.status === "On Trip") {
    showToast("Complete or cancel active trip before retiring this vehicle.");
    return;
  }
  vehicle.status = status;
  persist(`Vehicle marked ${status}.`);
  renderShell();
}

function deleteVehicle(vehicleId) {
  const activeTrip = state.data.trips.some((trip) => trip.vehicleId === vehicleId && ["Draft", "Dispatched"].includes(trip.status));
  if (activeTrip) {
    showToast("Vehicle is attached to an open trip.");
    return;
  }
  state.data.vehicles = state.data.vehicles.filter((vehicle) => vehicle.id !== vehicleId);
  persist("Vehicle deleted.");
  renderShell();
}

function setDriverStatus(driverId, status) {
  const driver = getDriver(driverId);
  if (!driver) return;
  if (status === "Suspended" && driver.status === "On Trip") {
    showToast("Complete or cancel active trip before suspending this driver.");
    return;
  }
  driver.status = status;
  persist(`Driver marked ${status}.`);
  renderShell();
}

function deleteDriver(driverId) {
  const activeTrip = state.data.trips.some((trip) => trip.driverId === driverId && ["Draft", "Dispatched"].includes(trip.status));
  if (activeTrip) {
    showToast("Driver is attached to an open trip.");
    return;
  }
  state.data.drivers = state.data.drivers.filter((driver) => driver.id !== driverId);
  persist("Driver deleted.");
  renderShell();
}

function remindDriver(driverId) {
  const driver = getDriver(driverId);
  if (!driver) return;
  showToast(`License reminder queued for ${driver.name}.`);
}

function remindDocument(vehicleId) {
  const vehicle = getVehicle(vehicleId);
  if (!vehicle) return;
  showToast(`Document reminder queued for ${vehicle.name}.`);
}

function exportData(kind) {
  const rowsByKind = {
    vehicles: state.data.vehicles,
    drivers: state.data.drivers,
    trips: state.data.trips.map((trip) => ({
      ...trip,
      vehicle: getVehicle(trip.vehicleId)?.name || "",
      driver: getDriver(trip.driverId)?.name || ""
    })),
    maintenance: state.data.maintenance.map((entry) => ({
      ...entry,
      vehicle: getVehicle(entry.vehicleId)?.name || ""
    })),
    expenses: [
      ...state.data.fuelLogs.map((entry) => ({
        type: "Fuel",
        vehicle: getVehicle(entry.vehicleId)?.name || "",
        detail: `${entry.liters} liters`,
        date: entry.date,
        amount: entry.cost
      })),
      ...state.data.expenses.map((entry) => ({
        type: entry.category,
        vehicle: getVehicle(entry.vehicleId)?.name || "",
        detail: entry.notes,
        date: entry.date,
        amount: entry.amount
      }))
    ],
    analytics: state.data.vehicles.map((vehicle) => {
      const analysis = vehicleAnalysis(vehicle.id);
      return {
        vehicle: vehicle.name,
        registration: vehicle.registration,
        distance: analysis.distance,
        fuel: analysis.fuel,
        efficiency: analysis.efficiency.toFixed(2),
        operationalCost: analysis.operationalCost,
        revenue: analysis.revenue,
        roi: analysis.roi.toFixed(2)
      };
    })
  };

  downloadCsv(rowsByKind[kind] || [], `transitops-${kind}.csv`);
}

function getFilteredVehiclesForDashboard() {
  return state.data.vehicles.filter((vehicle) => {
    const byType = state.filters.dashboardType === "All" || vehicle.type === state.filters.dashboardType;
    const byStatus = state.filters.dashboardStatus === "All" || vehicle.status === state.filters.dashboardStatus;
    const byRegion = state.filters.dashboardRegion === "All" || vehicle.region === state.filters.dashboardRegion;
    return byType && byStatus && byRegion;
  });
}

function getFilteredVehicles() {
  const search = state.filters.vehicleSearch.toLowerCase();
  return [...state.data.vehicles]
    .filter((vehicle) => {
      const bySearch = !search || `${vehicle.name} ${vehicle.registration}`.toLowerCase().includes(search);
      const byStatus = state.filters.vehicleStatus === "All" || vehicle.status === state.filters.vehicleStatus;
      const byType = state.filters.vehicleType === "All" || vehicle.type === state.filters.vehicleType;
      return bySearch && byStatus && byType;
    })
    .sort((a, b) => {
      const field = state.filters.vehicleSort;
      if (typeof a[field] === "number") return a[field] - b[field];
      return String(a[field]).localeCompare(String(b[field]));
    });
}

function getFilteredDrivers() {
  const search = state.filters.driverSearch.toLowerCase();
  return [...state.data.drivers]
    .filter((driver) => {
      const bySearch = !search || `${driver.name} ${driver.licenseNumber}`.toLowerCase().includes(search);
      const byStatus = state.filters.driverStatus === "All" || driver.status === state.filters.driverStatus;
      return bySearch && byStatus;
    })
    .sort((a, b) => b.safetyScore - a.safetyScore);
}

function computeMetrics(vehicles) {
  const activeVehicles = vehicles.filter((vehicle) => vehicle.status !== "Retired");
  const availableVehicles = vehicles.filter((vehicle) => vehicle.status === "Available").length;
  const onTripVehicles = vehicles.filter((vehicle) => vehicle.status === "On Trip").length;
  const inShopVehicles = vehicles.filter((vehicle) => vehicle.status === "In Shop").length;
  const driversOnDuty = state.data.drivers.filter((driver) => ["Available", "On Trip"].includes(driver.status)).length;
  const utilization = activeVehicles.length ? Math.round((onTripVehicles / activeVehicles.length) * 100) : 0;
  const operationalCost = state.data.vehicles.reduce((sum, vehicle) => sum + vehicleAnalysis(vehicle.id).operationalCost, 0);
  const efficiencies = state.data.vehicles.map((vehicle) => vehicleAnalysis(vehicle.id).efficiency).filter(Boolean);
  const bestEfficiency = efficiencies.length ? `${Math.max(...efficiencies).toFixed(1)} km/L` : "No completed fuel data";

  return {
    activeVehicles: activeVehicles.length,
    availableVehicles,
    onTripVehicles,
    inShopVehicles,
    driversOnDuty,
    utilization,
    operationalCost,
    bestEfficiency
  };
}

function vehicleAnalysis(vehicleId) {
  const vehicle = getVehicle(vehicleId);
  const trips = state.data.trips.filter((trip) => trip.vehicleId === vehicleId && trip.status === "Completed");
  const fuelLogs = state.data.fuelLogs.filter((log) => log.vehicleId === vehicleId);
  const maintenance = state.data.maintenance.filter((entry) => entry.vehicleId === vehicleId);
  const distance = trips.reduce((sum, trip) => sum + Number(trip.actualDistance || trip.plannedDistance || 0), 0);
  const fuel = fuelLogs.reduce((sum, log) => sum + Number(log.liters || 0), 0);
  const fuelCost = fuelLogs.reduce((sum, log) => sum + Number(log.cost || 0), 0);
  const maintenanceCost = maintenance.reduce((sum, entry) => sum + Number(entry.cost || 0), 0);
  const revenue = trips.reduce((sum, trip) => sum + Number(trip.revenue || 0), 0);
  const operationalCost = fuelCost + maintenanceCost;
  const efficiency = fuel ? distance / fuel : 0;
  const roi = vehicle?.acquisitionCost ? ((revenue - operationalCost) / vehicle.acquisitionCost) * 100 : 0;

  return {
    distance,
    fuel,
    fuelCost,
    maintenanceCost,
    operationalCost,
    revenue,
    efficiency,
    roi
  };
}

function getLicenseAlerts() {
  return state.data.drivers
    .map((driver) => ({ ...driver, licenseState: getLicenseState(driver) }))
    .filter((driver) => ["Expired", "Expiring"].includes(driver.licenseState));
}

function getLicenseState(driver) {
  const days = daysUntil(driver.licenseExpiry);
  if (days < 0) return "Expired";
  if (days <= 30) return "Expiring";
  return "Valid";
}

function validateTrip({ vehicleId, driverId, cargoWeight }) {
  const vehicle = getVehicle(vehicleId);
  const driver = getDriver(driverId);
  const checks = [];

  checks.push({
    ok: Boolean(vehicle),
    message: "Vehicle is required."
  });
  checks.push({
    ok: Boolean(driver),
    message: "Driver is required."
  });

  if (vehicle) {
    checks.push({
      ok: vehicle.status === "Available",
      message: `${vehicle.name} is ${vehicle.status} and cannot be dispatched.`
    });
    checks.push({
      ok: Number(cargoWeight) <= Number(vehicle.capacity),
      message: `Cargo weight must not exceed ${vehicle.name}'s ${formatNumber(vehicle.capacity)} kg capacity.`
    });
    checks.push({
      ok: !["Retired", "In Shop"].includes(vehicle.status),
      message: "Retired or In Shop vehicles must not appear in dispatch."
    });
  }

  if (driver) {
    checks.push({
      ok: driver.status === "Available",
      message: `${driver.name} is ${driver.status} and cannot be assigned.`
    });
    checks.push({
      ok: getLicenseState(driver) !== "Expired",
      message: `${driver.name}'s license is expired.`
    });
    checks.push({
      ok: driver.status !== "Suspended",
      message: "Suspended drivers cannot be assigned."
    });
  }

  return checks;
}

function canDriverDispatch(driver) {
  return driver.status === "Available" && getLicenseState(driver) !== "Expired";
}

function getDispatchableVehicles() {
  return state.data.vehicles.filter((vehicle) => vehicle.status === "Available");
}

function getDispatchableDrivers() {
  return state.data.drivers.filter(canDriverDispatch);
}

function getVehicle(idValue) {
  return state.data.vehicles.find((vehicle) => vehicle.id === idValue);
}

function getDriver(idValue) {
  return state.data.drivers.find((driver) => driver.id === idValue);
}

function getTrip(idValue) {
  return state.data.trips.find((trip) => trip.id === idValue);
}

function metricCard(label, value, note, tone) {
  return `
    <article class="metric-card ${tone}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
      <small>${escapeHtml(note)}</small>
    </article>
  `;
}

function workflowStep(number, label) {
  return `
    <div class="workflow-step">
      <span>${number}</span>
      <strong>${escapeHtml(label)}</strong>
    </div>
  `;
}

function selectField(label, name, options, value, isFilter = true) {
  const attr = isFilter ? `data-filter="${name}"` : `name="${name}"`;
  return `
    <label>
      ${escapeHtml(label)}
      <select ${attr}>
        ${options.map((option) => `<option value="${escapeAttr(option)}" ${String(option) === String(value) ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
      </select>
    </label>
  `;
}

function selectEntityField(label, name, items, mainKey, subKey, allowBlank = false) {
  return `
    <label>
      ${escapeHtml(label)}
      <select name="${name}" required>
        ${allowBlank ? `<option value="">Unassigned</option>` : ""}
        ${items.map((item) => `
          <option value="${escapeAttr(item.id)}">${escapeHtml(item[mainKey])}${subKey ? ` - ${escapeHtml(item[subKey])}` : ""}</option>
        `).join("")}
      </select>
    </label>
  `;
}

function selectVehicleFilter(label, name, options, value) {
  return `
    <label>
      ${escapeHtml(label)}
      <select data-filter="${name}">
        ${options.map((option) => {
          const vehicle = getVehicle(option);
          const display = option === "All" ? "All" : `${vehicle?.name || option} - ${vehicle?.registration || ""}`;
          return `<option value="${escapeAttr(option)}" ${option === value ? "selected" : ""}>${escapeHtml(display)}</option>`;
        }).join("")}
      </select>
    </label>
  `;
}

function renderValidationList(checks) {
  return `
    <ul class="validation-list">
      ${checks.map((check) => `
        <li class="${check.ok ? "ready" : "blocked"}">
          <strong>${check.ok ? "OK" : "BLOCK"}</strong>
          <span>${escapeHtml(check.message)}</span>
        </li>
      `).join("")}
    </ul>
  `;
}

function ledgerTable(title, rows) {
  return `
    <div>
      <h3>${escapeHtml(title)}</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Vehicle</th><th>Detail</th><th>Date</th><th>Amount</th></tr></thead>
          <tbody>
            ${rows.map((row) => `
              <tr>
                <td>${escapeHtml(row.vehicle)}<br><span class="muted">${escapeHtml(row.meta || "")}</span></td>
                <td>${escapeHtml(row.detail || "-")}</td>
                <td>${formatDate(row.date)}</td>
                <td>${formatCurrency(row.amount)}</td>
              </tr>
            `).join("") || emptyRow(4, `No ${title.toLowerCase()} yet.`)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function barChart(items, formatter) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return `
    <div class="chart bar-chart" style="--bars: ${items.length};">
      ${items.map((item) => {
        const height = Math.max(6, Math.round((item.value / max) * 190));
        return `
          <div class="bar-group">
            <span class="bar-value">${escapeHtml(formatter(item.value))}</span>
            <div class="bar" style="height: ${height}px;"></div>
            <span class="bar-label">${escapeHtml(item.label)}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function statusPill(status) {
  return `<span class="status-pill status-${slug(status)}">${escapeHtml(status)}</span>`;
}

function emptyRow(colspan, message) {
  return `<tr><td colspan="${colspan}"><div class="empty-state"><strong>${escapeHtml(message)}</strong></div></td></tr>`;
}

function persist(message) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
  showToast(message);
}

function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return clone(seedData);
  }

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return clone(seedData);
  }
}

function getSessionUser() {
  const idValue = localStorage.getItem(SESSION_KEY);
  return users.find((user) => user.id === idValue) || null;
}

function downloadCsv(rows, filename) {
  if (!rows.length) {
    showToast("No rows to export.");
    return;
  }

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(","))
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast(`${filename} exported.`);
}

function csvCell(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toastEl.classList.remove("show"), 2600);
}

function promptNumber(label, defaultValue) {
  const value = window.prompt(label, String(defaultValue));
  if (value === null) return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    showToast("Please enter a valid number.");
    return null;
  }
  return number;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function id(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function daysUntil(dateString) {
  if (!dateString) return Infinity;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(`${dateString}T00:00:00`);
  return Math.ceil((date - today) / 86400000);
}

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${dateString}T00:00:00`));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1
  }).format(Number(value || 0));
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
