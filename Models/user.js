const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 6, 
  },
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ai-images", 
    },
  ],
});


module.exports = mongoose.model("user", userSchema);
