const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");
const { setFlash } = require("./middleware");

//authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", //this means that user will be found user 'email' in the user schema
      passReqToCallback: true, //this allows "req" to be a part of the callback function
    }, //whenever passport is being called --> email & password will be sent along
    function (req, email, password, done) {
      //done is a callback function which is reporting back to passportJs
      //find a user and establish identity
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          req.flash("error", err);
          return done(err);
        }
        if (!user || user.password != password) {
          req.flash("error", "Invalid Username/Password");
          return done(null, false); //no error but authetication failed
        }
        return done(null, user); //no error, user found and being returned, go for serializing
      });
    }
  )
);

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id); //this will automatically encrypt the user.id and store it in the cookie
});

// deserialising the user from key in the cookie
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding user--> Passport");
      return done(err);
    }
    return done(null, user); //id is deserialised and user is being found and returned
  });
});

//check if user is authenticated
passport.checkAuthentication = function (req, res, next) {
  //if user is authenticated,then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }
  //if user is noth signed in
  return res.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    //req.user contains the current signed in user from the session cookie and we're sending it to the locals for the views.
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
