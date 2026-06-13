const Integration = require("../models/Integration");

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

module.exports = {
    createIntegration,
    getIntegrations,
};