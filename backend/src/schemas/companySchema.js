const {
    z
} = require("zod");

const createCompanySchema = z.object({
    name: z.string().min(3, "Company name must have at least 3 characters"),
    industry: z.string().min(2, "Industry is required"),
    country: z.string().min(2, "Country is required"),
});

module.exports = {
    createCompanySchema,
};