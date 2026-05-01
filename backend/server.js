import authRoutes from "./routes/authRoutes.js";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.get("/api/v1/auth",authRoutes);

app.use("/api/v1", adminRoutes);

app.use("/api/products", productRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));
