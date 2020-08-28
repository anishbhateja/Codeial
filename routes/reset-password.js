const express = require("express");
const router = express.Router();

const resetPasswordController = require("../controllers/reset_password_controller");

router.get("/", resetPasswordController.inputEmail);
router.post("/find-user", resetPasswordController.findUser);
// router.post(
//   "/change-password/:accessToken",
//   resetPasswordController.changePassword
// );
router.use("/change-password", require("./change-password"));
router.get(
  "/input-password/:accessToken",
  resetPasswordController.inputPassword
);

module.exports = router;
