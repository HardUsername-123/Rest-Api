const Product = require("../models/products");

//get all product service
const getAllProducts = async (req, res) => {
  return await Product.find();
};

//create product service
const addProduct = async (products) => {
  const newProduct = new Product(products);
  return await newProduct.save();
};

module.exports = {
  getAllProducts,
  addProduct,
};
