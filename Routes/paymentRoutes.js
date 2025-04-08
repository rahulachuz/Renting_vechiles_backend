import express from "express";
import {
  createPaymentIntent,
  getPaymentDetails,
  createCheckoutSession, // 👈 Add this import
} from "../Controllers/paymentController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create Payment Intent (used for frontend payment forms like CardElement)
router.post("/create", protect, createPaymentIntent);

// ✅ Get Payment Details by ID
router.get("/:paymentId", protect, getPaymentDetails);

// ✅ Create Stripe Checkout Session (redirect to Stripe payment page)
router.post("/checkout", protect, createCheckoutSession); // 👈 Add this route

export default router;
