const cloudinary = require("../Utils/cloudinary");
const imageModel = require("../Models/images");
const userModel = require("../Models/user");
require("dotenv").config();

const Image = async (req, res) => {
  const { searchText } = req.body;
  const userId = req.user.id;

  try {
    const fetch = (await import("node-fetch")).default;

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
    const buffer = await blob.arrayBuffer();

    const cloudinaryResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "Ai-Images" },
        (error, result) => {
          if (error) reject(new Error("Failed to upload image to Cloudinary"));
          else resolve(result);
        }
      );
      uploadStream.end(Buffer.from(buffer));
    });

    const newImage = await imageModel.create({
      searchText,
      userId,
      imageUrl: cloudinaryResponse.secure_url,
      imagePublicId: cloudinaryResponse.public_id,
    });

    await userModel.findByIdAndUpdate(userId, {
      $push: { images: newImage._id },
    });

    res.status(200).json({ imageUrl: newImage.imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await imageModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
    if (!history.length)
      return res.status(404).json({ message: "No history found." });
    res.status(200).json({ history });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch history.", error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.postId;
    const post = await imageModel.findById(imageId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(post.imagePublicId);
        console.log("Media deleted from Cloudinary.");
      } catch (cloudinaryError) {
        console.error("Error deleting media from Cloudinary:", cloudinaryError);
      }
    }

    await imageModel.findByIdAndDelete(imageId);

    await userModel.findByIdAndUpdate(post.userId, {
      $pull: { images: imageId },
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Error deleting post", error: err.message });
  }
};

module.exports = { Image, getHistory, deleteImage };
