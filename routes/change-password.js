const express = require("express");
const router = express.Router();
const resetPasswordController = require("../controllers/reset_password_controller");

router.post("/:accessToken", resetPasswordController.changePassword);

module.exports = router;
