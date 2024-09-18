const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const mysql = require("mysql");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "shhh, its a secret",
    resave: false,
    saveUninitialized: true,
  })
);

//database connection MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "login",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Successfully connect to database");
});

global.db = db;

//embeded ejs engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Sign up route
app.get("/", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
  const { username, pass } = req.body;

  const checkUserQuery = "SELECT * FROM users WHERE username = ?";

  db.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).render("signup", {
        message: "Error signing up. Please try again.",
      });
    } else if (results.length > 0) {
      return res
        .status(400)
        .render("signup", { message: "User Already Exists!" });
    } else {
      const query = "INSERT INTO users(username, pass) VALUES (?, ?)";

      db.query(query, [username, pass], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).render("signup", {
            message: "Error signing up. Please try again.",
          });
        }
        req.session.username = username;
        res.redirect("/login");
      });
    }
  });
});

// Log in route
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, pass } = req.body;

  const loginQuery = "SELECT * FROM users WHERE username = ? AND pass = ?";

  db.query(loginQuery, [username, pass], (err, results) => {
    if (err) {
      return res.render("login", {
        message: "Error Log in. Please try again.",
      });
    }

    if (results.length > 0) {
      req.session.username = username;
      res.redirect("/protectedPage");
    } else {
      res.render("login", { message: "Invalid Credentials!" });
    }
  });
});

//protected page with session
app.get("/protectedPage", (req, res) => {
  res.render("protectedPage", { username: req.session.username });
});

//log out
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    console.log("User logged out");
  });
  res.redirect("/login");
});

app.use((err, req, res, next) => {
  // <-- Added next here
  console.log(err);
  res.redirect("/login");
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
