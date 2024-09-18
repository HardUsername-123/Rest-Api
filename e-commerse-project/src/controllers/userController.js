const userService = require("../services/userService");
const bcrypt = require("bcrypt");

//sign up user
exports.createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = await userService.createUser({ username, password });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//login user
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userLogin = await userService.loginUser({ username });
    const isMatch = await bcrypt.compare(password, userLogin.password);

    if (!userLogin) {
      return res.status(400).json({ message: "Wrong username or password!" });
    } else if (!isMatch) {
      return res.status(400).json({ message: "Wrong password!" });
    } else {
      return res
        .status(200)
        .json({ message: " Log in successfilly", userLogin });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
