require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const driverRoutes = require('./routes/drivers');
const tripRoutes = require('./routes/trips');
const maintenanceRoutes = require('./routes/maintenance');
const fuelRoutes = require('./routes/fuel');
const expenseRoutes = require('./routes/expenses');
const costRoutes = require('./routes/costs');
const dashboardRoutes = require('./routes/dashboard');
const reportRoutes = require('./routes/reports');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/drivers', driverRoutes);
app.use('/trips', tripRoutes);
app.use('/maintenance', maintenanceRoutes);
app.use('/fuel-logs', fuelRoutes);
app.use('/expenses', expenseRoutes);
app.use('/vehicles', costRoutes); // adds GET /vehicles/:id/operational-cost
app.use('/dashboard', dashboardRoutes);
app.use('/reports', reportRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
