const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const flash = require("connect-flash");
const path = require("path");
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "shhh its a secret",
    resave: false,
    saveUninitialized: false,
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.message = req.flash();
  next();
});

// Set User in res.locals
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

//static files
app.use(express.static(path.join(__dirname, "public")));

//View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//routes
const authRoutes = require("./routes/authRoutes");
const addProduct = require("./routes/productRoutes");

app.use("/users", authRoutes);
app.use("/", addProduct);

module.exports = app;
