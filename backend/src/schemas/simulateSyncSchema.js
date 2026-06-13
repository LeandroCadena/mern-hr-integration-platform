const {
    z
} = require("zod");
const {
    objectIdSchema
} = require("./commonSchemas");

const simulateSyncBodySchema = z.object({
    count: z.coerce
        .number()
        .int()
        .min(1, "Count must be at least 1")
        .max(100, "Count cannot exceed 100")
        .default(5),
});

const simulateSyncParamsSchema = z.object({
    integrationId: objectIdSchema,
});

module.exports = {
    simulateSyncBodySchema,
    simulateSyncParamsSchema,
};