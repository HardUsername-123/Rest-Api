require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "shhh it's a secret",
    resave: false,
    saveUninitialized: true,
  })
);

//ejs engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB has connected..."))
  .catch((err) => console.log(err));

const indexRoutse = require("./routes/index");

app.use("/api", indexRoutse);

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
