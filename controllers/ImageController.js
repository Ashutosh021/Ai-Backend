const axios = require('axios');
const imageModel = require('../models/imageModel'); 

const historyData = async (req, res) => {
  const userId = req.query.userId;  
  try {
    const history = await imageModel.find({ userId });
    res.json({
      status: "success",
      msg: "Data fetched successfully",
      history
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: "Failed to fetch data",
      error: error.message
    });
  }
};

const generateImage = async (req, res) => {
  const body = req.body;
  const searchText = body.searchText || "cat"; 
  const userEmail = body.userEmail;
  try {
    const response = await axios.get(`https://loremflickr.com/320/240/${searchText}`);
    const imageUrl = response.request.res.responseUrl; // Get the final URL of the random image

    await imageModel.create({
      searchText: searchText,
      imageUrl: imageUrl,// Save the image URL along with the search text
      userId: userEmail
    });

    res.json({
      status: 'success',
      data: {
        imageUrl: imageUrl,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Image generation failed'
    });
  }
};

module.exports = {
  generateImage,
  historyData
};
