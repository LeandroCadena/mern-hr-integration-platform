const Company = require("../models/Company");
const asyncHandler = require("../utils/asyncHandler");

const createCompany = asyncHandler(async (req, res) => {
    const {
        name,
        industry,
        country
    } = req.body;

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
});

const getCompanies = asyncHandler(async (req, res) => {
    const companies = await Company.find({
        createdBy: req.user._id,
    }).sort({
        createdAt: -1
    });

    res.json({
        companies
    });
});

module.exports = {
    createCompany,
    getCompanies,
};