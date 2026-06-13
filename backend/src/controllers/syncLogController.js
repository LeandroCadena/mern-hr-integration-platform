const SyncLog = require("../models/SyncLog");

const getSyncLogs = async (req, res) => {
    try {
        const {
            status,
            provider,
            companyId,
            page = 1,
            limit = 10,
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

        const skip = (Number(page) - 1) * Number(limit);

        const logs = await SyncLog.find(filters)
            .populate("companyId")
            .populate("triggeredBy", "name email role")
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(Number(limit));

        const totalLogs = await SyncLog.countDocuments(filters);

        res.json({
            logs,
            pagination: {
                totalLogs,
                currentPage: Number(page),
                totalPages: Math.ceil(totalLogs / Number(limit)),
                limit: Number(limit),
            },
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