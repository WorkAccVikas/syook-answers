const express = require("express");
const router = express.Router();
const userController = require("../../controller/User/User");

/** POST : http://localhost:8000/api/v1/user/signup
 * @body : {
    "username": "demo",
    "password": "demo"
    }
 */
router.post("/signup", userController.register);

/** POST : http://localhost:8000/api/v1/user/signin
 * @body : {
    "username": "demo",
    "password": "demo"
    }
 */
router.post("/signin", userController.login);

module.exports = router;
