const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
    name: { // Matches frontend "name"
        type: String,
        required: true
    },
    ownerName: { // Matches frontend "ownerName"
        type: String,
        required: true
    },
    contact: { // Matches frontend "contact"
        type: String, // String is safer for phone numbers (handling +91 or leading zeros)
        required: true
    },
    price: { // Matches frontend "price"
        type: Number,
        required: true
    },
    location: { // Matches frontend "location"
        type: String,
        required: true
    },
    distanceFromUni: { // Matches frontend "distanceFromUni"
        type: String
    },
    type: { // Matches frontend "type"
        type: String,
        enum: ["Boys", "Girls", "Co-ed"],
        default: "Co-ed"
    },
    amenities: { // Matches frontend "amenities"
        type: String
    },
    description: { // Matches frontend "description"
        type: String
    },
    image: {
        type: String,
        default: "/images/default-pg.jpg"
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',// Reference to your User model
        required: true
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const hostelModel = mongoose.model("hostelsInfo", hostelSchema);
module.exports = hostelModel;