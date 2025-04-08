// backend/controllers/vehicleController.js
import Vehicle from "../Models/Vehicle.js";
import cloudinary from "../Config/cloudinaryConfig.js";

// ✅ Add Single Vehicle with Cloudinary Upload or URL
export const addVehicle = async (req, res) => {
  try {
    const { make, model, year, pricePerDay, description, image } = req.body;

    let imageUrl = image;

    // ✅ Upload to Cloudinary only if the image is not a URL
    if (!image.startsWith("http")) {
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        folder: "vehicle-rentals",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      });

      if (!uploadedResponse.secure_url) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      imageUrl = uploadedResponse.secure_url; // Use Cloudinary URL
    }

    // ✅ Create New Vehicle
    const vehicle = new Vehicle({
      make,
      model,
      year,
      pricePerDay,
      description,
      imageUrl,
    });

    const savedVehicle = await vehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    res.status(500).json({ message: "Error adding vehicle", error });
  }
};

// ✅ Add Multiple Vehicles at Once
export const addMultipleVehicles = async (req, res) => {
  try {
    const vehiclesToInsert = await Promise.all(
      req.body.map(async (vehicle) => {
        let imageUrl = vehicle.image;

        // ✅ Upload only if image is not a URL
        if (!vehicle.image.startsWith("http")) {
          const uploadedResponse = await cloudinary.uploader.upload(
            vehicle.image,
            {
              folder: "vehicle-rentals",
              transformation: [{ width: 500, height: 500, crop: "limit" }],
            }
          );

          if (uploadedResponse.secure_url) {
            imageUrl = uploadedResponse.secure_url;
          } else {
            throw new Error(`Failed to upload image for ${vehicle.make}`);
          }
        }

        return {
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          pricePerDay: vehicle.pricePerDay,
          description: vehicle.description,
          imageUrl,
        };
      })
    );

    // ✅ Insert all vehicles at once
    const vehicles = await Vehicle.insertMany(vehiclesToInsert);
    res.status(201).json({
      message: "Vehicles added successfully",
      data: vehicles,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding vehicles", error });
  }
};

// ✅ Get All Vehicles
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vehicles", error });
  }
};

// ✅ Get Vehicle by ID
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vehicle", error });
  }
};
