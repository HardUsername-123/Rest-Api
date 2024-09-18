const User = require("../models/users");

//sign up user service
const createUser = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};

//log in user service
const loginUser = async (userData) => {
  return await User.findOne(userData);
};

module.exports = {
  createUser,
  loginUser,
};
