const express = require("express");
const router = express.Router();
const healthCheckController = require("../../controller/HealthCheck/HealthCheck");

/** GET : http://localhost:8000/api/v1/healthCheck */
router.route("/").get(healthCheckController.healthCheck);

module.exports = router;
