const mongoose = require("mongoose");

const ReviewVideoSchema = mongoose.Schema({
  Name: {
    type: String,
    required: [true, "Name field is required"],
  },
  Job: {
    type: String,
    required: [true, "Job is required"],
  },
  VideoLink: {
    type: String,
    required: [true, "VideoLink is required"],
  },
  Rating: {
    type: Number,
    required: [true, "Rating is required"],
  },
  CompanyID: {
    type: String,
    required: [true, "CompanyID is required"],
  },
  cloudinaryDetails: { type: Object },
  ProfilePicture:{
    type: String,
    default: null,
  }
});

module.exports = mongoose.model("ReviewVideo", ReviewVideoSchema);
