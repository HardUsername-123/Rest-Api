const productService = require("../services/productService");
const Product = require("../models/products");
const upload = require("../config/multer");

// Get all products controller
exports.getDashboard = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.render("dashboard", {
      products: products,
      search: req.query.search,
      message: req.query.message,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load dashboard: " + err.message });
  }
};

// Create products controller
exports.addProduct = [
  upload.single("image"),
  async (req, res) => {
    try {
      if (
        !req.body.name ||
        !req.body.price ||
        !req.body.category ||
        !req.file
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        image: "/uploads/" + req.file.filename,
        category: req.body.category,
      });

      await product.save();
      res.redirect("/");
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to create product: " + err.message });
    }
  },
];

// Route to display product id details
exports.getProductId = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("product", { product: product });
};

//search product
exports.searchProducts = async (req, res, next) => {
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
    res.render("dashboard", { products: products, search: search });
  } catch (error) {
    next(error);
  }
};
