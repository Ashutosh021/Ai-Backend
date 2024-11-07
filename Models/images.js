const mongoose = require("mongoose");
const imageSchema = mongoose.Schema({
  searchText: {
    type: String,
    required: true,
  },
  userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "ai-images",
    },
  imageUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const imageModel = mongoose.model("ai-images", imageSchema);
module.exports = imageModel;
