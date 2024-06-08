const express = require("express");
const imageRouter = express.Router();
const { generateImage, historyData} = require("../controllers/ImageController.js");

imageRouter.route("/images").post(generateImage);
imageRouter.route("/history").get(historyData);

module.exports = imageRouter;
