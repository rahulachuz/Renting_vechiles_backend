// backend/Models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle", // Reference to the Vehicle model
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "inr",
    },
    status: {
      type: String,
      enum: ["succeeded", "pending", "failed"],
      default: "pending",
    },
    receiptUrl: {
      type: String,
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
