const express = require("express");
const validateRequest = require("../middleware/validateRequest");
const {
    registerSchema,
    loginSchema
} = require("../schemas/authSchema");
const {
    register,
    login,
    getMe
} = require("../controllers/authController");
const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.get("/me", protect, getMe);

module.exports = router;