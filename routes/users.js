const express = require("express");
const router = express.Router();
const passport = require("passport");

const users_controller = require("../controllers/users_controller");

router.get("/profile", passport.checkAuthentication, users_controller.profile);
router.get("/sign-up", users_controller.signUp);
router.get("/sign-in", users_controller.signIn);
router.get("/sign-out", users_controller.destroySession);
router.post("/create", users_controller.create);
//use passport as a middleware to authenticate
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  users_controller.createSession
);

module.exports = router;

//we want to access the user_controller using this route
