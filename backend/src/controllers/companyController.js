const Company = require("../models/Company");

const createCompany = async (req, res) => {
    try {
        const { name, industry, country } = req.body;

        const company = await Company.create({
            name,
            industry,
            country,
            createdBy: req.user._id,
        });

        res.status(201).json({
            message: "Company created successfully",
            company,
        });
    } catch (error) {
        res.status(500).json({
            message: "Create company error",
            error: error.message,
        });
    }
};

const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find({
            createdBy: req.user._id,
        }).sort({ createdAt: -1 });

        res.json({ companies });
    } catch (error) {
        res.status(500).json({
            message: "Get companies error",
            error: error.message,
        });
    }
};

module.exports = {
    createCompany,
    getCompanies,
};