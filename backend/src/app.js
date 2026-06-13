const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const syncLogRoutes = require("./routes/syncLogRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const integrationRoutes = require("./routes/integrationRoutes");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const {
    errorHandler
} = require("./middleware/errorMiddleware");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        message: "Too many auth attempts, please try again later",
    },
});

app.get("/", (req, res) => {
    res.json({
        message: "MERN HR Integration Platform API is running",
    });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/sync-logs", syncLogRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/integrations", integrationRoutes);
app.use(errorHandler);

module.exports = app;