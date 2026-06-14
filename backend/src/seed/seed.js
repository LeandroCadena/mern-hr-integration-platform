const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
const Company = require("../models/Company");
const Integration = require("../models/Integration");

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const password = await bcrypt.hash("123456", 10);

        const user = await User.findOneAndUpdate({
            email: "admin@demo.com"
        }, {
            name: "Demo Admin",
            email: "admin@demo.com",
            password,
            role: "admin",
        }, {
            upsert: true,
            new: true
        });

        const company = await Company.findOneAndUpdate({
            name: "Acme Payroll Inc."
        }, {
            name: "Acme Payroll Inc.",
            industry: "Payroll Technology",
            country: "United States",
            createdBy: user._id,
        }, {
            upsert: true,
            new: true
        });

        await Integration.findOneAndUpdate({
            companyId: company._id,
            providerName: "Workday",
        }, {
            companyId: company._id,
            providerName: "Workday",
            status: "connected",
        }, {
            upsert: true,
            new: true
        });

        console.log("Seed completed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error.message);
        process.exit(1);
    }
};

seed();