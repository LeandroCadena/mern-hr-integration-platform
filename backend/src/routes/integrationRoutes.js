const express = require("express");
const {
    createIntegration,
    getIntegrations,
    simulateProviderSync,
} = require("../controllers/integrationController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("admin", "developer"), createIntegration);
router.get("/", protect, getIntegrations);
router.post(
    "/:integrationId/simulate-sync",
    protect,
    authorize("admin", "developer"),
    simulateProviderSync
);

module.exports = router;