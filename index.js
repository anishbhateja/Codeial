const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");

//used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require("connect-mongo")(session); //everytime server is restarted,session cookies are removed,hence we need a way to store them
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

app.use(
  sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: "extended",
    prefix: "/css",
  })
);

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static("./assets"));
app.use("/uploads", express.static(__dirname + "/uploads")); //make the upload path available to the browser

app.use(expressLayouts); //needs to called before routes, as after routes->controller->view, it should be declared earlier itself that layout has to be used.contacts

//extract styles and scripts from sub pages into layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//mongo store is used to store the session cookie in the db
app.use(
  session({
    name: "codeial",
    //TODO change secret before deployment in production mode
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db, //this will store the session cookies in the database
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect mongodb setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash()); //has to be placed after session as it uses session cookies.
app.use(customMware.setFlash);

// use express router
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${port}`); //backtick- includes variables within the string
  } else {
    console.log(`Express server is running on port: ${port}`);
  }
});
