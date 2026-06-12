const express = require("express");

const {
    createProvider,
    getProviders
} = require(
    "../controllers/providerController"
);

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router =
    express.Router();

router.post(
    "/",
    protect,
    authorize("admin", "developer"),
    createProvider
);

router.get(
    "/",
    protect,
    getProviders
);

module.exports = router;