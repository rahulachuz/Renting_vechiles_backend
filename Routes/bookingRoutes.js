import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
} from "../Controllers/bookingController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create Booking (User)
router.post("/", protect, createBooking);

// ✅ Get All Bookings (Admin)
router.get("/", protect, admin, getAllBookings);

// ✅ Get User's Bookings (original route)
router.get("/mybookings", protect, getUserBookings);

// ✅ Alias route for frontend compatibility
router.get("/my", protect, getUserBookings);

export default router;
