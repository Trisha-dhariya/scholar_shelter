const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const router = express.Router();

//signup api

router.post('/Signup', async (req, res) => {
    try {console.log("BODY:", req.body);
        const { userName, email, password } = req.body;
        console.log("Checking existing user...");
        // check if user already exists
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({message:"User already exists"});
        }
console.log("Hashing password...");
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
console.log("Creating user...");
        // create user
        const user = await User.create({
            userName,
            email,
            password: hashedPassword,
            profileCompleted: false
        })

        res.status(201).json({
            message: "Signup successful",
            userId: user._id
        });

    } catch (err) {
        console.log("ERROR:", err);   
        res.status(500).json(err.message);
    }
});


//login api
router.post("/Login", async (req, res) => {
    try {
        const { userName, password } = req.body;
        console.log("Checking existing user..."); 
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json("Invalid credentials");
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            profileCompleted: user.profileCompleted,
            user: {
              _id: user._id,
              userName: user.userName,
              email: user.email
                 }
        });

    } catch (err) {
        res.status(500).json(err.message);
    }
});
router.get("/test", (req, res) => {
  console.log("TEST API HIT");
  res.send("Working");
});
//user api
// GET User Profile (Private Data)
router.get("/user", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Grabs the string after "Bearer "

    if (!token) {
      return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    // 1. Verify the Token using your Secret Key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Search MongoDB for this specific User ID
    // .select("-password") is crucial—never send the hash to the frontend!
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found in Database" });
    }

    // 3. Send the personal data back to Axios
    res.json(user);
    
  } catch (err) {
    // If the token is fake or expired, jwt.verify throws an error
    res.status(403).json({ message: "Invalid or Expired Token" });
  }
});
//fetching pgs
router.get("/pgs", (req, res) => {
  const dummyPGs = [
    {
      _id: "1",
      name: "Starlight Boys PG",
      location: "Near North University",
      price: 6500,
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=200",
    },
    {
      _id: "2",
      name: "Green Villa Girls PG",
      location: "East College Road",
      price: 8000,
      image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=200",
    },
    {
      _id: "3",
      name: "Scholar's Home (Co-ed)",
      location: "Main University Gate",
      price: 4500,
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=200",
    }
  ];
  res.json(dummyPGs);
});
module.exports=router;