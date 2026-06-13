const Employee = require("../models/Employee");
const {
    normalizeWorkdayEmployee
} = require("../adapters/workdayAdapter");
const {
    normalizeADPEmployee
} = require("../adapters/adpAdapter");
const SyncLog = require("../models/SyncLog");
const Integration = require("../models/Integration");

const importEmployees = async (req, res) => {
    try {
        const {
            provider,
            companyId,
            employees
        } = req.body;

        const supportedProviders = ["Workday", "ADP"];

        if (!provider) {
            return res.status(400).json({
                message: "Provider is required"
            });
        }

        if (!supportedProviders.includes(provider)) {
            return res.status(400).json({
                message: "Unsupported provider"
            });
        }

        if (!companyId) {
            return res.status(400).json({
                message: "Company ID is required"
            });
        }

        if (!Array.isArray(employees) || employees.length === 0) {
            return res.status(400).json({
                message: "Employees must be a non-empty array",
            });
        }

        const integration = await Integration.findOne({
            companyId,
            providerName: provider,
        });

        if (!integration) {
            return res.status(400).json({
                message: `No ${provider} integration found for this company`,
            });
        }

        const normalizedEmployees =
            provider === "Workday" ?
            employees.map(normalizeWorkdayEmployee) :
            employees.map(normalizeADPEmployee);

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

        await Integration.findOneAndUpdate({
            companyId,
            providerName: provider,
        }, {
            lastSyncAt: new Date(),
            status: "connected",
        });

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
        try {
            await SyncLog.create({
                provider: req.body.provider || "unknown",
                companyId: req.body.companyId,
                status: "failed",
                recordsProcessed: 0,
                errorMessage: error.message,
                triggeredBy: req.user._id,
            });
        } catch (logError) {
            console.error("Failed to create sync error log:", logError.message);
        }

        res.status(500).json({
            message: "Import employees error",
            error: error.message,
        });
    }
};

const getEmployees = async (req, res) => {
    try {
        const {
            companyId,
            provider,
            search
        } = req.query;

        const filters = {};

        if (companyId) {
            filters.companyId = companyId;
        }

        if (provider) {
            filters.provider = provider;
        }

        if (search) {
            filters.$or = [{
                    firstName: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    lastName: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    externalId: {
                        $regex: search,
                        $options: "i"
                    }
                },
            ];
        }

        const employees = await Employee.find(filters)
            .populate("companyId")
            .sort({
                createdAt: -1
            });

        res.json({
            employees
        });
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