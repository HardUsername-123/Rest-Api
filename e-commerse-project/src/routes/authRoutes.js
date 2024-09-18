const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// routes
router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/logout", authController.logout);

//Sign up user render
router.get("/signup", (req, res) => {
  res.render("signup");
});

//Login user render
router.get("/login", async (req, res) => {
  res.render("login");
});

//protected page
router.get("/", (req, res) => {
  res.render("dashboard");
});

//home
router.get("/home", (req, res) => {
  res.render("home");
});

module.exports = router;
