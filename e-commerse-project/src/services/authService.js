const User = require("../models/users");
const bcrypt = require("bcrypt");
const passport = require("passport");

//user sign up auth service
exports.signup = async ({ username, password }) => {
  try {
    let user = await User.findOne({ username });

    if (user) {
      throw new Error("User already exists");
    } else {
      user = new User({ username, password });
      await user.save();
      return user;
    }
  } catch (err) {
    throw err;
  }
};

//user login auth service
exports.login = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
};

//user logout auth service
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
