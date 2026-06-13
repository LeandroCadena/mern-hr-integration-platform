const express = require("express");
const validateRequest = require("../middleware/validateRequest");
const {
    createCompany,
    getCompanies,
} = require("../controllers/companyController");
const {
    createCompanySchema
} = require("../schemas/companySchema");
const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("admin"), validateRequest(createCompanySchema), createCompany);
router.get("/", protect, getCompanies);

module.exports = router;