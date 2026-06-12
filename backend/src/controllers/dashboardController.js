const Company = require("../models/Company");
const Provider = require("../models/Provider");
const Employee = require("../models/Employee");
const SyncLog = require("../models/SyncLog");

const getDashboardMetrics = async (req, res) => {
    try {
        const totalCompanies = await Company.countDocuments();
        const totalProviders = await Provider.countDocuments();
        const totalEmployees = await Employee.countDocuments();
        const totalSyncLogs = await SyncLog.countDocuments();

        const successfulSyncs = await SyncLog.countDocuments({
            status: "success",
        });

        const failedSyncs = await SyncLog.countDocuments({
            status: "failed",
        });

        const employeesByProvider = await Employee.aggregate([
            {
                $group: {
                    _id: "$provider",
                    count: { $sum: 1 },
                },
            },
        ]);

        const syncsByStatus = await SyncLog.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const recentSyncLogs = await SyncLog.find()
            .populate("companyId", "name")
            .populate("triggeredBy", "name email")
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalCompanies,
            totalProviders,
            totalEmployees,
            totalSyncLogs,
            successfulSyncs,
            failedSyncs,
            employeesByProvider,
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