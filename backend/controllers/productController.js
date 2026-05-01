import Product from "../models/Product.js";


// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      createdBy: req.user.id, 
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// GET ALL PRODUCTS (only user's products)
export const getProducts = async (req, res) => {
  try {
    const products = await Product
      .find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// GET SINGLE PRODUCT
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // ownership check
    if (product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // ownership check
    if (product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true, // 🔥 important
      }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // ownership check
    if (product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await product.deleteOne();

    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};