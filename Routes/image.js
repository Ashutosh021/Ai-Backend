const express = require("express");
const { Image, getHistory,deleteImage } = require("../Controller/image");
const { isAuthenticated } = require("../Middleware/isAuthenticated");

const imageRoutes = express.Router();

// Route to generate, store, and return an image
imageRoutes.post("/generate-image", isAuthenticated, Image);
imageRoutes.get("/history", isAuthenticated, getHistory);
imageRoutes.delete("/delete/:postId", isAuthenticated, deleteImage);

module.exports = imageRoutes;
