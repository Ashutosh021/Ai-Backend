const cloudinary = require("../Utils/cloudinary"); // Cloudinary configuration
const imageModel = require("../Models/images"); // Image Models
const userModel = require("../Models/user"); // User Models
require("dotenv").config();


const Image = async (req, res) => {
  const { searchText } = req.body;
  const userId = req.user.id;
  try {
    // Dynamically import `node-fetch`
    const fetch = (await import("node-fetch")).default;

    // Step 1: Generate Image from Hugging Face
    const response = await fetch(
      "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: searchText }),
      }
    );

    const blob = await response.blob();

    // Step 2: Upload to Cloudinary
    const cloudinaryResponse = await new Promise(async (resolve, reject) => {
      try {
        const buffer = await blob.arrayBuffer();
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image",folder: "Ai-Temp"},
          (error, result) => {
            if (error)
              reject(new Error("Failed to upload image to Cloudinary"));
            else resolve(result);
          }
        );
        uploadStream.end(Buffer.from(buffer)); // Pass the buffer here
      } catch (err) {
        reject(err);
      }
    });

    const imageUrl = cloudinaryResponse.secure_url;

    // Step 3: Save to MongoDB
    const newImage = new imageModel({
      searchText,
      userId,
      imageUrl,
    });
    await newImage.save();

    // Optionally update user with image reference
    await userModel.findByIdAndUpdate(userId, {
      $push: { images: newImage._id },
    });

    // Step 4: Return image URL to frontend
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Controller to get the user's image generation history
const getHistory = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you store the user ID in req.user from authentication middleware

    // Fetch history of generated images by user
    const history = await imageModel.find({ userId })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .exec();

    if (!history || history.length === 0) {
      return res.status(404).json({ message: "No history found." });
    }

    // Return the history of generated images
    res.status(200).json({ history });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Failed to fetch history. Please try again." });
  }
};





module.exports = { Image,getHistory };
