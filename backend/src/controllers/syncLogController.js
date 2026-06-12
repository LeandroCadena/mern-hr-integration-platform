const SyncLog = require("../models/SyncLog");

const getSyncLogs = async (req, res) => {
    try {
        const logs = await SyncLog.find()
            .populate("companyId")
            .populate("triggeredBy", "name email role")
            .sort({ createdAt: -1 });

        res.json({ logs });
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