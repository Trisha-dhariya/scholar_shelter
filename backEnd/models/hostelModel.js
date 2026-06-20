const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        trim: true
    },
    ownerName: { 
        type: String,
        required: true,
        trim: true
    },
    contact: { 
        type: String, // String safely preserves leading zeros and country codes (+91)
        required: true,
        trim: true
    },
    price: { 
        type: Number,
        required: true
    },
    // ADDED: Crucial field matching frontend "location" string input
    location: { 
        type: String,
        required: true,
        trim: true
    },
    latitude: { 
        type: Number, 
        required: true, 
        //default: 30.3403 // Default fallback center
    }, 
    longitude: { 
        type: Number, 
        required: true, 
        //default: 77.9156 // Default fallback center
    },
    distanceFromUni: { 
        type: String,
        trim: true
    },
    type: { 
        type: String,
        enum: ["Boys", "Girls", "Co-ed"],
        default: "Co-ed"
    },
    amenities: { 
        type: String,
        trim: true
    },
    description: { 
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267" // Matching your frontend Unsplash baseline default string
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // Reference to your User model collection
        required: true
    }
}, { timestamps: true }); // Automatically injects createdAt and updatedAt fields

const hostelModel = mongoose.model("hostelsInfo", hostelSchema);
module.exports = hostelModel;