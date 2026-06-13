const express = require("express");
const validateRequest = require("../middleware/validateRequest");
const {
    employeeImportSchema
} = require("../schemas/employeeSchema");
const {
    importEmployees,
    getEmployees,
} = require("../controllers/employeeController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/import", protect, authorize("admin", "developer"), validateRequest(employeeImportSchema), importEmployees);
router.get("/", protect, getEmployees);

module.exports = router;