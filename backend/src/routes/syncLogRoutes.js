const express = require("express");
const { getSyncLogs } = require("../controllers/syncLogController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getSyncLogs);

module.exports = router;