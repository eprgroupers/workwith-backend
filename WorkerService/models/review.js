const mongoose = require("mongoose");

const JobSchema = mongoose.Schema({
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
    default: 0,
  },
  workerID: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
