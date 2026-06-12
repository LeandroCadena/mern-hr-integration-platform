const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            enum: ["ADP", "Workday", "BambooHR"],
            required: true,
        },

        status: {
            type: String,
            enum: ["connected", "disconnected"],
            default: "connected",
        },

        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "Provider",
    providerSchema
);