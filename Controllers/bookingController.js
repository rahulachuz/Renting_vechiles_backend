import Booking from "../Models/Booking.js";
import User from "../Models/User.js";
import Vehicle from "../Models/Vehicle.js";
import nodemailer from "nodemailer";

// ✅ Create Booking and Send Email
export const createBooking = async (req, res) => {
  try {
    const { vehicle, startDate, endDate, totalPrice } = req.body;

    const booking = new Booking({
      vehicle,
      user: req.user.id,
      startDate,
      endDate,
      totalPrice,
    });

    const savedBooking = await booking.save();

    // ✅ Get user and vehicle details for email
    const user = await User.findById(req.user.id);
    const vehicleInfo = await Vehicle.findById(vehicle);

    // ✅ Setup email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "✅ Booking Confirmed!",
      html: `
        <h2>Booking Confirmed 🎉</h2>
        <p>Hi ${user.name},</p>
        <p>Your booking for <strong>${vehicleInfo.make} ${
        vehicleInfo.model
      }</strong> has been confirmed.</p>
        <p><strong>Start:</strong> ${new Date(startDate).toDateString()}</p>
        <p><strong>End:</strong> ${new Date(endDate).toDateString()}</p>
        <p><strong>Total:</strong> ₹${totalPrice}</p>
        <p>Thank you for using our service!</p>
      `,
    };

    // ✅ Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking or sending email:", error);
    res.status(500).json({ message: "Error creating booking", error });
  }
};

// ✅ Get All Bookings (Admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate(
      "vehicle user",
      "make model name email"
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

// ✅ Get Bookings for Logged-in User
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "vehicle",
      "make model image pricePerDay"
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bookings", error });
  }
};
