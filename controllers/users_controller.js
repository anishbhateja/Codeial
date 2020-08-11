const User = require("../models/user");

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

module.exports.update = function (req, res) {
  if (req.user.id == req.params.id) {
    let user_id = req.params.id;
    //UPDATE FUNCTION
    User.findByIdAndUpdate(user_id, req.body, function (err, user) {
      return res.redirect("back");
    });
  } else {
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
