const express = require("express");
const {
    createCompany,
    getCompanies,
} = require("../controllers/companyController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("admin"), createCompany);
router.get("/", protect, getCompanies);

module.exports = router;