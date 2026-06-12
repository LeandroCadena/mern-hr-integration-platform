const Employee = require("../models/Employee");
const { normalizeWorkdayEmployee } = require("../adapters/workdayAdapter");
const { normalizeADPEmployee } = require("../adapters/adpAdapter");
const SyncLog = require("../models/SyncLog");

const importEmployees = async (req, res) => {
    try {
        const { provider, companyId, employees } = req.body;

        const supportedProviders = ["Workday", "ADP"];

        if (!provider) {
            return res.status(400).json({ message: "Provider is required" });
        }

        if (!supportedProviders.includes(provider)) {
            return res.status(400).json({ message: "Unsupported provider" });
        }

        if (!companyId) {
            return res.status(400).json({ message: "Company ID is required" });
        }

        if (!Array.isArray(employees) || employees.length === 0) {
            return res.status(400).json({
                message: "Employees must be a non-empty array",
            });
        }

        const normalizedEmployees =
            provider === "Workday"
                ? employees.map(normalizeWorkdayEmployee)
                : employees.map(normalizeADPEmployee);

        const employeesToCreate = normalizedEmployees.map((employee) => ({
            ...employee,
            provider,
            companyId,
        }));

        const operations = employeesToCreate.map((employee) => ({
            updateOne: {
                filter: {
                    companyId: employee.companyId,
                    provider: employee.provider,
                    externalId: employee.externalId,
                },
                update: {
                    $set: employee,
                },
                upsert: true,
            },
        }));

        const result = await Employee.bulkWrite(operations);

        await SyncLog.create({
            provider,
            companyId,
            status: "success",
            recordsProcessed: employeesToCreate.length,
            triggeredBy: req.user._id,
        });

        res.status(201).json({
            message: "Employees imported successfully",
            recordsProcessed: employeesToCreate.length,
            inserted: result.upsertedCount,
            updated: result.modifiedCount,
        });
    } catch (error) {
        res.status(500).json({
            message: "Import employees error",
            error: error.message,
        });
    }
};

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
            .populate("companyId")
            .sort({ createdAt: -1 });

        res.json({ employees });
    } catch (error) {
        res.status(500).json({
            message: "Get employees error",
            error: error.message,
        });
    }
};

module.exports = {
    importEmployees,
    getEmployees,
};