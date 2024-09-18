const express = require("express");
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../config/multer");
const router = express.Router();

router.get("/upload", (req, res) => {
  res.render("upload");
});

router.post("/products", productController.addProduct);
router.get("/product/:id", productController.getProductId);
router.get("/", productController.getDashboard);
router.get("/search", productController.searchProducts);

module.exports = router;
