import Stripe from "stripe";
import dotenv from "dotenv";
import Payment from "../Models/payment.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ 1. Create Payment Intent (original logic)
export const createPaymentIntent = async (req, res) => {
  const { vehicleId, amount, currency, metadata } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      metadata,
    });

    const payment = new Payment({
      user: req.user.id,
      vehicle: vehicleId,
      paymentIntentId: paymentIntent.id,
      amount,
      currency,
      status: "pending",
    });

    await payment.save();

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Error creating payment", error });
  }
};

// ✅ 2. Get Payment Details
export const getPaymentDetails = async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await Payment.findById(paymentId)
      .populate("user", "name email")
      .populate("vehicle", "make model pricePerDay");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ message: "Error fetching payment details", error });
  }
};

// ✅ 3. Create Stripe Checkout Session and redirect user
export const createCheckoutSession = async (req, res) => {
  const { vehicleId, amount, vehicleName, userEmail } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: userEmail || req.user.email || "default@example.com",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: vehicleName,
            },
            unit_amount: amount * 100, // Amount in paise
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/payment-cancel",
      metadata: {
        userId: req.user.id,
        vehicleId,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error.message);
    res
      .status(500)
      .json({ message: "Failed to create checkout session", error });
  }
};
