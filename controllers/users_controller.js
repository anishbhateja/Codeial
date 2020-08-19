const User = require("../models/user");
const fs = require("fs");
const path = require("path");

module.exports.profile = function (req, res) {
  //exporting the action home controller
  let user_id = req.params.id;
  User.findById(user_id, function (err, user) {
    if (user) {
      return res.render("user_profile", {
        title: "Profile Page",
        profile_user: user,
      });
    } else {
      console.log("error in finding user");
      return res.redirect("back");
    }
  });
};

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      //UPDATE FUNCTION
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("*****Multer Error", err);
        }

        user.name = req.body.name; //wouldn't have been able to read the body if not passed through above fun, since it's a multipart form
        user.email = req.body.email;
        if (req.file) {
          if (user.avatar) {
            if (fs.existsSync(path.join(__dirname, "..", user.avatar))) {
              //checks if the path exists
              //if path exists, in that case delete exixting avatar
              fs.unlinkSync(path.join(__dirname, "..", user.avatar));
            }
          }

          //this is saving the path of uploaded file in the avatar field in user.
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        return res.redirect("back");
      });
    } catch {
      req.flash("error", err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorized!");
    res.status(401).send("Unauthorized");
  }
};

module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_in", {
    title: "Codeial | Sign In",
  });
};

//get the sign up data

module.exports.create = function (req, res) {
  // checking if both passwords match
  if (req.body.password != req.body.confirm_password) {
    console.log("Password Mismatch !");
    return res.redirect("back");
  }

  //check if that email id is unique in the database
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("Error in finding user while signing up !");
    }
    if (!user) {
      //if no user is found->create that user and redirect to sign-in page !
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("Error in creating user while signing up");
        } else {
          return res.redirect("/users/sign-in");
        }
      });
    } else {
      // user already exists, redirect to sign-up page !
      console.log("User already exists !");
      return res.redirect("/users/sign-in");
    }
  });
};

//sign in and create session for user

module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully");
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  req.flash("success", "You have logged out !");
  req.logout();
  res.redirect("/");
};
