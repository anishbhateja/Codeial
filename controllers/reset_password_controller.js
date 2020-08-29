const User = require("../models/user");
const ResetPassword = require("../models/password");
const crypto = require("crypto");
const passwordMailer = require("../mailers/password_mailer");
const queue = require("../config/kue");
const passwordWorker = require("../workers/forgot_password_worker");

module.exports.inputEmail = function (req, res) {
  res.render("reset_password", {
    title: "Reset Password",
  });
};

module.exports.findUser = async function (req, res) {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    let resetPasswordUser = await ResetPassword.create({
      user: user._id,
      accessToken: crypto.randomBytes(10).toString("hex"),
      isValid: true,
    });

    //Concatenating the url with the accessToken generated above
    var redirectURL = `/reset-password/input-password/${resetPasswordUser.accessToken}`;
    //worker resposible for sending the email takes in the data in the form of an object,
    let userDetails = {
      redirectURL: redirectURL,
      user: user,
    };
    //job is being queued in the "forgotPassword" queue plus the useDetails are passed, This is being sent to the passwordWorker->passwordMailer
    let job = queue.create("forgotPassword", userDetails).save(function (err) {
      if (err) {
        console.log("Error in sending to a queue", err);
        return;
      }
      console.log("job enqueued", job.data);
    });
    req.flash("success", "Check your registered email");
    return res.redirect("/");
  }
  console.log("Unable to find user");
};

module.exports.inputPassword = async function (req, res) {
  let accessToken = await ResetPassword.findOne({
    accessToken: req.params.accessToken,
  });
  if (accessToken.isValid) {
    return res.render("change_password", {
      title: "Update Password",
      accessToken: req.params.accessToken,
    });
  } else {
    return res.redirect("reset-password/find-user");
  }
};

module.exports.changePassword = async function (req, res) {
  let accessToken = await ResetPassword.findOne({
    accessToken: req.params.accessToken,
  });
  if (accessToken.isValid) {
    if (req.body.password1 === req.body.password2) {
      let user = await User.findById(accessToken.user);
      if (user) {
        user.password = req.body.password1;
        user.save();
        accessToken.isValid = false;
        accessToken.save();
        req.flash("success", "Password Changed successfully!");
        return res.redirect("/");
      }
      req.flash("error", "Unable to find user");
      return res.redirect("reset-password/find-user");
    } else {
      req.flash("error", "password mismatch!");
      return res.redirect("back");
    }
  } else {
    req.flash("error", "access token is invalid!");
    return res.redirect("back");
  }
};
