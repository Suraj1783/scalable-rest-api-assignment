import express from "express";
import { register, login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/protected", protect, (req, res) => {
  res.json({ msg: "Protected route", user: req.user });
});

export default router;