// backend/routes/vehicleRoutes.js
import express from "express";
import {
  addVehicle,
  getVehicles,
  getVehicleById,
  addMultipleVehicles, // ✅ Add Bulk Route Function
} from "../Controllers/vehicleController.js";

const router = express.Router();

// ✅ Add Single Vehicle Route
router.post("/", addVehicle);

// ✅ Add Multiple Vehicles at Once
router.post("/bulk", addMultipleVehicles); // ✅ Add this route

// ✅ Get All Vehicles
router.get("/", getVehicles);

// ✅ Get Vehicle by ID
router.get("/:id", getVehicleById);

export default router;
