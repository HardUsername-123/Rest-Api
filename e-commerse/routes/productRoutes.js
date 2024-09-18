const express = require("express");
const Product = require("../models/products");

module.exports = (upload) => {
  const router = express.Router();

  // Middleware to check authentication
  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/users/login");
  };

  // Route to display all products or search results
  router.get("/", async (req, res, next) => {
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

      const products = await Product.find(query);
      res.render("index", { products: products, search: search });
    } catch (error) {
      next(error);
    }
  });

  // Route to display form to add a new product
  router.get("/add", isAuthenticated, (req, res) => {
    res.render("add");
  });

  // Route to handle new product submission
  router.post(
    "/add",
    isAuthenticated,
    upload.single("image"),
    async (req, res) => {
      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        image: "/uploads/" + req.file.filename,
        category: req.body.category,
      });
      await product.save();
      req.flash("success", "Product added successfully!");
      res.redirect("/");
    }
  );

  // Route to display product details
  router.get("/product/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("product", { product: product });
  });

  // Route to display form to edit a product
  router.get("/edit/:id", isAuthenticated, async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("edit", { product: product });
  });

  // Route to handle product edit
  router.post(
    "/edit/:id",
    isAuthenticated,
    upload.single("image"),
    async (req, res) => {
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
      res.redirect("/");
    }
  );

  // Route to handle product deletion
  router.get("/delete/:id", isAuthenticated, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    req.flash("success", "Product deleted successfully!");
    res.redirect("/");
  });

  return router;
};
