const express = require("express");
const {
    createIntegration,
    getIntegrations,
} = require("../controllers/integrationController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("admin", "developer"), createIntegration);
router.get("/", protect, getIntegrations);

module.exports = router;