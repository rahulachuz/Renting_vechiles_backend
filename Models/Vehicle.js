import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  imageUrl: { type: String, required: true }, // Cloudinary URL
  description: { type: String },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
