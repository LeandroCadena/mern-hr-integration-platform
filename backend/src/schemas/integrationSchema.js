const {
    z
} = require("zod");

const createIntegrationSchema = z.object({
    providerName: z.enum(["Workday", "ADP", "BambooHR"]),
    companyId: z.string().min(1, "Company ID is required"),
});

module.exports = {
    createIntegrationSchema,
};