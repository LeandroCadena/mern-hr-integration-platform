const mongoose = require("mongoose");

const syncLogSchema = new mongoose.Schema(
    {
        provider: {
            type: String,
            required: true,
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        status: {
            type: String,
            enum: ["success", "failed"],
            required: true,
        },
        recordsProcessed: {
            type: Number,
            default: 0,
        },
        errorMessage: {
            type: String,
            default: null,
        },
        triggeredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SyncLog", syncLogSchema);