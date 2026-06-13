const Integration = require("../models/Integration");
const Employee = require("../models/Employee");
const SyncLog = require("../models/SyncLog");
const asyncHandler = require("../utils/asyncHandler");
const {
    generateMockEmployees
} = require("../services/mockProviderService");
const {
    normalizeWorkdayEmployee
} = require("../adapters/workdayAdapter");
const {
    normalizeADPEmployee
} = require("../adapters/adpAdapter");

const createIntegration = asyncHandler(async (req, res) => {
    const {
        providerName,
        companyId
    } = req.body;

    const existingIntegration = await Integration.findOne({
        companyId,
        providerName,
    });

    if (existingIntegration) {
        res.status(400);
        throw new Error(`${providerName} integration already exists for this company`);
    }

    const integration = await Integration.create({
        providerName,
        companyId,
        status: "connected",
    });

    res.status(201).json({
        message: "Integration created successfully",
        integration,
    });
});

const getIntegrations = asyncHandler(async (req, res) => {
    const integrations = await Integration.find()
        .populate("companyId")
        .sort({
            createdAt: -1
        });

    res.json({
        integrations
    });
});

const simulateProviderSync = asyncHandler(async (req, res) => {
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
        insertedRecords: result.upsertedCount,
        updatedRecords: result.modifiedCount,
        triggeredBy: req.user._id,
    });

    res.json({
        message: "Provider sync simulated successfully",
        recordsProcessed: employeesToUpsert.length,
        inserted: result.upsertedCount,
        updated: result.modifiedCount,
    });

});

module.exports = {
    createIntegration,
    getIntegrations,
    simulateProviderSync,
};