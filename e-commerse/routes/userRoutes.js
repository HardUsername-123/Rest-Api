// routes/usersRoutes.js
const express = require("express");
const passport = require("passport");
const User = require("../models/users");

const router = express.Router();

// Registration route

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.redirect("/users/login");
  } catch (error) {
    res.status(500).send("Error registering new users.");
  }
});

// Login route
router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/users/login");
  });
});

module.exports = router;
