const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post"); // Import the Post model

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get one user
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new user
router.post("/users", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//update user
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;

  const newUserUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  try {
    const updateUser = await User.findByIdAndUpdate(id, newUserUpdate, {
      new: true,
    });

    if (!updateUser) {
      return res.status(404).json({ message: " User not found" });
    }
    res.json(updateUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//delete user
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const userDel = await User.deleteOne({ _id: id });

    res.json({ message: "User deleted successfully", result: userDel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//For Posts collection/table relationnal with User collection
// Get all posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("author");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new post
router.post("/posts", async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author, // Assuming the author ID is passed in the request body
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
