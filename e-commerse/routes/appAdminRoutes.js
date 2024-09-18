// routes/appUserRoutes.js
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const session = require("express-session");
const Product = require("../models/products");
const AppAdmin = require("../models/appAdmin");
const { ensureAuthenticated, ensureAdmin } = require("../config/auth");

const app = express();

module.exports = (upload) => {
  const router = express.Router();

  // Session middleware
  app.use(
    session({
      secret: "its a secret",
      resave: false,
      saveUninitialized: false,
    })
  );

  //admin sign up
  router.get("/adminSignup", (req, res) => {
    res.render("adminSignup");
  });

  router.post("/adminSignup", async (req, res) => {
    const { admin, password } = req.body;
    try {
      const createAdmin = new AppAdmin({ admin, password });
      await createAdmin.save();
      res.redirect("/app/adminLogin");
    } catch (err) {
      res.send({ message: err.message });
    }
  });

  //login authentication middleware
  const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
      next();
    } else {
      res.redirect("/app/adminLogin");
    }
  };

  // Login routes
  router.get("/adminLogin", (req, res) => {
    res.render("adminLogin");
  });

  router.post("/adminLogin", async (req, res) => {
    const { admin, password } = req.body;
    try {
      const isAdmin = await AppAdmin.findOne({ admin });

      if (!isAdmin) {
        return res.redirect("/app/adminLogin");
      }

      const isMatch = await bcrypt.compare(password, isAdmin.password);

      if (!isMatch) {
        return res.redirect("/app/adminLogin");
      }

      req.session.isAuth = true;
      res.redirect("/app/adminDashboard");
    } catch (err) {
      res.json({ message: err.message });
    }
  });

  // Dashboard route
  router.get("/adminDashboard", isAuth, async (req, res) => {
    try {
      const products = await Product.find();
      res.render("adminDashboard", {
        products,
        message: req.flash("success"),
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  //id producr
  router.get("/adminDashboardproduct/:id", isAuth, async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("adminDashboardproduct", { product: product });
  });

  // Search route
  router.get("/adminSearch", isAuth, async (req, res, next) => {
    try {
      const query = {};
      let search = req.query.search;

      if (search) {
        search = search.trim();
        query.$or = [
          { name: new RegExp(search, "i") },
          { category: new RegExp(search, "i") },
        ];
      }

      const prods = await Product.find(query);
      res.render("adminDashboard", { products: prods, search: search });
    } catch (error) {
      next(error);
    }
  });

  // Logout route
  router.post("/adminLogout", (req, res) => {
    req.session.destroy(() => {
      console.log("Admin logged out");
      res.redirect("/app/adminLogin");
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.log(err);
    res.redirect("/app/adminLogin");
  });

  //----------------------------------------------------------------
  //admin handle the product
  // Route to display form to add a new product
  router.get("/add", isAuth, (req, res) => {
    res.render("add");
  });

  // Route to handle new product submission
  router.post("/add", isAuth, upload.single("image"), async (req, res) => {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      image: "/uploads/" + req.file.filename,
      category: req.body.category,
    });
    await product.save();
    req.flash("success", "Product added successfully!");
    res.redirect("/app/adminDashboard");
  });

  // Route to display product details
  router.get("/product/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("adminDashboardproduct", { product: product });
  });

  // Route to display form to edit a product
  router.get("/edit/:id", isAuth, async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("edit", { product: product });
  });

  // Route to handle product edit
  router.post("/edit/:id", isAuth, upload.single("image"), async (req, res) => {
    const updateData = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };
    if (req.file) {
      updateData.image = "/uploads/" + req.file.filename;
    }
    await Product.findByIdAndUpdate(req.params.id, updateData);
    req.flash("success", "Product update successfully!");
    res.redirect("/app/adminDashboard");
  });

  // Route to handle product deletion
  router.get("/delete/:id", isAuth, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    req.flash("success", "Product deleted successfully!");
    res.redirect("/app/adminDashboard");
  });

  return router;
};
