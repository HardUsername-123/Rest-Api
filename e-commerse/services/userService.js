const User = require("../models/users");

const createUser = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};

module.exports = {
  createUser,
};
