const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
    }
});

module.exports = mongoose.model("user", userSchema);