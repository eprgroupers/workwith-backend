const mongoose = require("mongoose");

const JobSchema = mongoose.Schema({
  Job: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
    default: null,
  },
  count: {
    type: Number,
    default: 0,
  },
  available: {
    type: Number,
    default: 0,
  },
  cloudinaryDetails: { type: Object },
});

module.exports = mongoose.model("Job", JobSchema);
