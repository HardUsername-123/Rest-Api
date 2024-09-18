require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("MongoDB connected..."));
  } catch (err) {
    console.log("Error", err);
    process.exit(1);
  }
};

module.exports = connectDB;
