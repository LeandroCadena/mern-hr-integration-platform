const {
    z
} = require("zod");

const registerSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must have at least 6 characters"),
    role: z.enum(["admin", "developer", "viewer"]).optional(),
});

const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

module.exports = {
    registerSchema,
    loginSchema,
};