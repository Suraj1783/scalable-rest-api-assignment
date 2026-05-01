import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE
router.post("/", protect, createProduct);

// READ ALL
router.get("/", protect, getProducts);

// READ SINGLE
router.get("/:id", protect, getProduct);

// UPDATE
router.put("/:id", protect, updateProduct);

// DELETE
router.delete("/:id", protect, deleteProduct);

export default router;