const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const User = require("../models/users");

//get all users
router.get("/users", async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//sign up user
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { username } = req.body;

  try {
    const checkUser = await User.findOne({ username: username });

    if (checkUser) {
      return res
        .status(400)
        .render("signup", { message: "Username has already exist!" });
    } else {
      const user = new User({
        username: req.body.username,
        password: req.body.password,
      });

      await user.save();
      res.status(201).render("signup", { message: "Sign up Successfully!" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//login user
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const login = await User.findOne({
      username: username,
      password: password,
    });

    if (!login) {
      return res
        .status(400)
        .render("login", { message: "Wrong username or password!" });
    } else {
      req.session.username = username;
      res.status(200).redirect("/api/home");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//to activate home page session
router.get("/home", (req, res) => {
  if (!req.session.username) {
    return res.status(401).redirect("/api/login");
  }
  res.render("home", { username: req.session.username });
});

//logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => console.log("User log out"));
  res.redirect("/api/login");
});

//**********************************************************/
// //user inser profile
// // Set up storage engine for multer
// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 },
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// }).single("uploads");

// function checkFileType(file, cb) {
//   const filetypes = /jpeg|jpg|png|gif/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb("Error: Images Only!");
//   }
// }

// router.get("/img", (req, res) => {
//   res.render("profile");
// });

// router.post("/uploads", async (req, res) => {
//   try {
//     // Use multer to handle the file upload
//     upload(req, res, async (err) => {
//       if (err) {
//         return res.send("Error uploading file.");
//       }
//       if (!req.file) {
//         return res.send("No file selected.");
//       }

//       const { username } = req.query;

//       req.session.username = username;

//       // Find the logged-in user
//       const user = await User.findOne({
//         username: username,
//       });

//       if (!user) {
//         return res.json({
//           message: "User not found or incorrect credentials.",
//         });
//       }

//       // Update the user's profile image
//       user.img = req.file.buffer;
//       user.imgContentType = req.file.mimetype;

//       await user.save();

//       return res.redirect("/api/home");
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal server error.");
//   }
// });

module.exports = router;
