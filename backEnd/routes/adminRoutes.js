const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// GET /api/pgs
router.get("/", async (req, res) => {
  try {
    const pgs = await PG.find(); // Assuming PG is your Mongoose model
    res.json(pgs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/pgs/:id
app.delete("/api/pgs/:id", async (req, res) => {
  const { adminId } = req.body; // You pass this from the frontend
  const MY_ADMIN_ID = "YOUR_SPECIFIC_USER_ID_HERE"; // The _id from your database

  // 1. Check if the user trying to delete is YOU
  if (adminId !== MY_ADMIN_ID) {
    return res.status(403).json({ message: "Access Denied: You are not the admin." });
  }

  // 2. Proceed with deletion
  try {
    await PG.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});