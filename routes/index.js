const express = require("express");
const router = express.Router();

const homeController = require("../controllers/home_controller"); //importing the action homecontroller

console.log("router loaded");

router.get("/", homeController.home);
router.use("/users", require("./users")); //if a route for users come, the it will take it to the users route.
router.use("/posts", require("./posts"));
router.use("/comments", require("./comments"));
router.use("/api", require("./api"));
router.use("/reset-password", require("./reset-password"));

//for any further routes,access from here
//router.use('./routerName', require('./routerfile'))

module.exports = router;
