const {
    z
} = require("zod");
const {
    objectIdSchema
} = require("./commonSchemas");

const employeeImportSchema = z.object({
    provider: z.enum(["Workday", "ADP"]),
    companyId: objectIdSchema,
    employees: z.array(z.record(z.any())).min(1, "Employees array cannot be empty"),
});

module.exports = {
    employeeImportSchema,
};