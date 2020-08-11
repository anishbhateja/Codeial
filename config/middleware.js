module.exports.setFlash = function (req, res, next) {
  res.locals.flash = {
    success: req.flash("success"),
    error: req.flash("error"),
  };
  next();
};
//here you are telling your express application to use 'connect-flash' library via app.use(flash()) middleware so that it can show those notifictaion.
//and here you are telling your express app to run 'setFlash' method on every incoming req via app.use(customMware.setFlash); middleware so that express app can set the the message in req to the local.flash so that it can be used by your .ejs files remember .ejs file have access to access to res.local
