const authService = require("../services/authService");

// user login auth controllers
exports.login = (req, res, next) => {
  authService.login(req, res, next);
};

//user sign up auth contollers
exports.signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    await authService.signup({ username, password });
    res.redirect("/users/login");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  authService.logout(req, res);
};
