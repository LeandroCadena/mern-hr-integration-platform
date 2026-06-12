const Provider = require("../models/Provider");

const createProvider = async (req, res) => {
    try {

        const {
            name,
            companyId
        } = req.body;

        const provider =
            await Provider.create({
                name,
                companyId
            });

        res.status(201).json({
            message:
                "Provider created successfully",
            provider
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Create provider error",
            error: error.message
        });

    }
};

const getProviders = async (
    req,
    res
) => {

    try {

        const providers =
            await Provider.find()
                .populate("companyId");

        res.json({
            providers
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Get providers error",
            error: error.message
        });

    }

};

module.exports = {
    createProvider,
    getProviders
};