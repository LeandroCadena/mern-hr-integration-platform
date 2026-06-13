const Integration = require("../models/Integration");
const Employee = require("../models/Employee");
const SyncLog = require("../models/SyncLog");
const {
    generateMockEmployees
} = require("../services/mockProviderService");
const {
    normalizeWorkdayEmployee
} = require("../adapters/workdayAdapter");
const {
    normalizeADPEmployee
} = require("../adapters/adpAdapter");

const createIntegration = async (req, res) => {
    try {
        const {
            providerName,
            companyId
        } = req.body;

        const integration = await Integration.create({
            providerName,
            companyId,
            status: "connected",
        });

        res.status(201).json({
            message: "Integration created successfully",
            integration,
        });
    } catch (error) {
        res.status(500).json({
            message: "Create integration error",
            error: error.message,
        });
    }
};

const getIntegrations = async (req, res) => {
    try {
        const integrations = await Integration.find()
            .populate("companyId")
            .sort({
                createdAt: -1
            });

        res.json({
            integrations
        });
    } catch (error) {
        res.status(500).json({
            message: "Get integrations error",
            error: error.message,
        });
    }
};

const simulateProviderSync = async (req, res) => {
    try {
        const {
            integrationId
        } = req.params;
        const {
            count = 5
        } = req.body;

        const integration = await Integration.findById(integrationId);

        if (!integration) {
            return res.status(404).json({
                message: "Integration not found",
            });
        }

        const providerName = integration.providerName;
        const companyId = integration.companyId;

        const mockEmployees = generateMockEmployees(providerName, Number(count));

        const normalizedEmployees =
            providerName === "Workday" ?
            mockEmployees.map(normalizeWorkdayEmployee) :
            mockEmployees.map(normalizeADPEmployee);

        const employeesToUpsert = normalizedEmployees.map((employee) => ({
            ...employee,
            provider: providerName,
            companyId,
        }));

        const operations = employeesToUpsert.map((employee) => ({
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

        await Integration.findByIdAndUpdate(integrationId, {
            status: "connected",
            lastSyncAt: new Date(),
        });

        await SyncLog.create({
            provider: providerName,
            companyId,
            status: "success",
            recordsProcessed: employeesToUpsert.length,
            triggeredBy: req.user._id,
        });

        res.json({
            message: "Provider sync simulated successfully",
            recordsProcessed: employeesToUpsert.length,
            inserted: result.upsertedCount,
            updated: result.modifiedCount,
        });
    } catch (error) {
        res.status(500).json({
            message: "Simulate provider sync error",
            error: error.message,
        });
    }
};

module.exports = {
    createIntegration,
    getIntegrations,
    simulateProviderSync,
};