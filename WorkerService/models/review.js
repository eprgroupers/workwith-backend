const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Review: {
    type: String,
    required: true,
  },
  Rating: {
    type: Number,
    default: null,
  },
  Date: {
    type: Date,
    default: Date.now(),
  },
  workerID: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
