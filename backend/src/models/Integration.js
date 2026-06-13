const mongoose = require("mongoose");

const integrationSchema = new mongoose.Schema({
    providerName: {
        type: String,
        enum: ["ADP", "Workday", "BambooHR"],
        required: true,
    },

    status: {
        type: String,
        enum: ["connected", "disconnected", "failed"],
        default: "connected",
    },

    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },

    lastSyncAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true
});

integrationSchema.index({
    companyId: 1,
    providerName: 1,
}, {
    unique: true,
});

module.exports = mongoose.model("Integration", integrationSchema);