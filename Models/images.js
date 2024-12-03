const mongoose = require("mongoose");

const imageSchema = mongoose.Schema(
  {
    searchText: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    imageUrl: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
  },
  { timestamps: true } 
);


const imageModel = mongoose.model("ai-images", imageSchema);
module.exports = imageModel;
