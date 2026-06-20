const express = require("express");
const router = express.Router();
const hostelModel = require("../models/hostelModel"); // Your Mongoose Schema file
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);

// 1. Cloudinary Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Setup Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'scholar_shelter_pgs',
      format: 'jpg', 
      public_id: file.fieldname + '-' + Date.now(),
    };
  },
});

const upload = multer({ storage: storage });

// --- POST: Add a new PG with Maps/Location Coordinates ---
router.post("/add", upload.single('image'), async (req, res) => {
    try {
        const { 
            name, ownerName, contact, price, location, 
            distanceFromUni, type, amenities, description, ownerId,
            latitude, longitude
        } = req.body;

        // 1. Validation for the 5 strictly required fields
        if (!name || !ownerName || !contact || !price || !location) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        // 2. Construct data object & include parsed coordinate markers
        const pgData = {
            name,
            ownerName,
            contact,
            price: Number(price), 
            location,
            distanceFromUni,
            type,
            amenities,
            description,
            ownerId,
            // Dynamic check or defaults to Dehradun center coordinate bounds
            latitude: latitude ? Number(latitude) : 30.3403,
            longitude: longitude ? Number(longitude) : 77.9156
        };

        // 3. Attach image from Cloudinary path only if file exists
        if (req.file) {
            pgData.image = req.file.path;
        }

        const newPG = new hostelModel(pgData);
        await newPG.save();

        res.status(201).json({ 
            success: true, 
            message: "PG Listed Successfully!", 
            data: newPG 
        });

    } catch (error) {
        console.error("FULL ERROR LOG:", error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            stack: error.stack
        });
    }
});

// --- GET: Fetch all PGs ---
router.get("/all", async (req, res) => {
    try {
        const allPGs = await hostelModel.find().sort({ createdAt: -1 });
        res.status(200).json(allPGs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching PGs", error: error.message });
    }
});

// --- GET: Fetch by ID ---
router.get("/:id", async (req, res) => {
    try {
        const pg = await hostelModel.findById(req.params.id);
        if (!pg) return res.status(404).json({ message: "PG not found" });
        res.status(200).json(pg);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// --- DELETE: Remove PG ---
router.delete("/delete/:id", async (req, res) => {
  try {
    const pg = await hostelModel.findById(req.params.id);
    if (!pg) {
      return res.status(404).json({ message: "Property not found" });
    }
    await hostelModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PUT: Update PG with Map Coordinates (Cleaned & Merged) ---
router.put("/update/:id", upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        // Ensure that numeric values are handled correctly if passed in updates
        if (updateData.price) updateData.price = Number(updateData.price);
        if (updateData.latitude) updateData.latitude = Number(updateData.latitude);
        if (updateData.longitude) updateData.longitude = Number(updateData.longitude);

        // If a new image was uploaded via Cloudinary/Multer
        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedPG = await hostelModel.findByIdAndUpdate(
            req.params.id, 
            { $set: updateData }, 
            { new: true } // Returns the newly updated document
        );

        if (!updatedPG) {
            return res.status(404).json({ message: "Property record context not found." });
        }

        res.status(200).json(updatedPG);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;