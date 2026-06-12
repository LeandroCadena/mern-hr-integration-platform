const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        externalId: {
            type: String,
            required: true,
        },

        firstName: {
            type: String,
            required: true,
        },

        lastName: {
            type: String,
            required: true,
        },

        email: {
            type: String,
        },

        provider: {
            type: String,
            required: true,
        },

        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
    },
    { timestamps: true }
);

employeeSchema.index(
    {
        companyId: 1,
        provider: 1,
        externalId: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model(
    "Employee",
    employeeSchema
);