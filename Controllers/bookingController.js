import Booking from "../Models/Booking.js";
import User from "../Models/User.js";
import Vehicle from "../Models/Vehicle.js";
import nodemailer from "nodemailer";

// ✅ Create Booking and Send Confirmation Email
export const createBooking = async (req, res) => {
  try {
    const { vehicle, startDate, endDate, totalPrice } = req.body;

    // Save booking to DB
    const booking = new Booking({
      vehicle,
      user: req.user.id,
      startDate,
      endDate,
      totalPrice,
    });

    const savedBooking = await booking.save();

    // Get user and vehicle info
    const user = await User.findById(req.user.id);
    const vehicleInfo = await Vehicle.findById(vehicle);

    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "✅ Booking Confirmed!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2 style="color: #4CAF50;">✅ Booking Successful!</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Thank you for choosing our Vehicle Rental Service.</p>
          <p>Your booking for <strong>${vehicleInfo.make} ${
        vehicleInfo.model
      }</strong> has been successfully confirmed.</p>
          <ul style="padding-left: 20px;">
            <li><strong>Start Date:</strong> ${new Date(
              startDate
            ).toDateString()}</li>
            <li><strong>End Date:</strong> ${new Date(
              endDate
            ).toDateString()}</li>
            <li><strong>Total Price:</strong> ₹${totalPrice}</li>
          </ul>
          <p style="margin-top: 20px;">We appreciate your business and hope you have a smooth and enjoyable ride. 🚗</p>
          <p>If you have any questions, feel free to contact us anytime.</p>
          <hr style="margin-top: 30px;" />
          <p style="font-size: 12px; color: #777;">This is an automated message from Vehicle Rental. Please do not reply directly to this email.</p>
        </div>
      `,
    };

    // Send email
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

// ✅ Get Bookings for Logged-in User (with imageUrl debug)
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate({
      path: "vehicle",
      select: "make model imageUrl pricePerDay",
    });

    bookings.forEach((booking, i) => {
      if (!booking.vehicle) {
        console.warn(`⚠️ Vehicle not found for booking ${booking._id}`);
      } else {
        console.log(`🖼️ [${i}] Vehicle Image URL: ${booking.vehicle.imageUrl}`);
      }
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ Error fetching user bookings:", error);
    res.status(500).json({ message: "Error fetching user bookings", error });
  }
};
