const SyncLog = require("../models/SyncLog");

const getSyncLogs = async (req, res) => {
    try {
        const {
            status,
            provider,
            companyId
        } = req.query;

        const filters = {};

        if (status) {
            filters.status = status;
        }

        if (provider) {
            filters.provider = provider;
        }

        if (companyId) {
            filters.companyId = companyId;
        }

        const logs = await SyncLog.find(filters)
            .populate("companyId")
            .populate("triggeredBy", "name email role")
            .sort({
                createdAt: -1
            });

        res.json({
            logs
        });
    } catch (error) {
        res.status(500).json({
            message: "Get sync logs error",
            error: error.message,
        });
    }
};

module.exports = {
    getSyncLogs,
};