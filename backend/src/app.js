const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const providerRoutes = require("./routes/providerRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const syncLogRoutes = require("./routes/syncLogRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const integrationRoutes = require("./routes/integrationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "MERN HR Integration Platform API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/sync-logs", syncLogRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/integrations", integrationRoutes);

module.exports = app;