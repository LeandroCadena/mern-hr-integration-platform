const Company = require("../models/Company");
const Integration = require("../models/Integration");
const Employee = require("../models/Employee");
const SyncLog = require("../models/SyncLog");

const getDashboardMetrics = async (req, res) => {
    try {
        const totalCompanies = await Company.countDocuments();
        const totalIntegrations = await Integration.countDocuments();
        const totalEmployees = await Employee.countDocuments();
        const totalSyncLogs = await SyncLog.countDocuments();

        const successfulSyncs = await SyncLog.countDocuments({
            status: "success",
        });

        const failedSyncs = await SyncLog.countDocuments({
            status: "failed",
        });

        const employeesByIntegration = await Employee.aggregate([{
            $group: {
                _id: "$integrationId",
                count: {
                    $sum: 1
                },
            },
        }, ]);

        const syncsByStatus = await SyncLog.aggregate([{
            $group: {
                _id: "$status",
                count: {
                    $sum: 1
                },
            },
        }, ]);

        const recentSyncLogs = await SyncLog.find()
            .populate("companyId", "name")
            .populate("triggeredBy", "name email")
            .sort({
                createdAt: -1
            })
            .limit(5);

        res.json({
            totalCompanies,
            totalIntegrations,
            totalEmployees,
            totalSyncLogs,
            successfulSyncs,
            failedSyncs,
            employeesByIntegration,
            syncsByStatus,
            recentSyncLogs,
        });
    } catch (error) {
        res.status(500).json({
            message: "Dashboard metrics error",
            error: error.message,
        });
    }
};

module.exports = {
    getDashboardMetrics,
};