const express = require("express");
const {
    importEmployees,
    getEmployees,
} = require("../controllers/employeeController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/import", protect, authorize("admin", "developer"), importEmployees);
router.get("/", protect, getEmployees);

module.exports = router;