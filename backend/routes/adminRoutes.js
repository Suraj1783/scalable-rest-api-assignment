import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/admin", protect, isAdmin, (req, res) => {
  res.send("Admin Access");
});

export default router;