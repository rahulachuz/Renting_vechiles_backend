import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./Config/dbConfig.js";
import vehicleRoutes from "./Routes/vehicleRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import bookingRoutes from "./Routes/bookingRoutes.js";
import paymentRoutes from "./Routes/paymentRoutes.js";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://renting-vehicle-front-end-mfl7.vercel.app",
];

// ✅ CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Allow preflight OPTIONS requests for all routes
app.options("*", cors());

// ✅ Parse JSON
app.use(express.json());

// ✅ Serve static files from "uploads" folder
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// ✅ Routes
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
