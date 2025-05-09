// backend/routes/authRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../Controllers/authController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

export default router;
