const mongoose = require("mongoose");

const DesignSchema = mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
    required: true,
  },
  Pricing: {
    type: String,
  },
  CompanyID: {
    type: String,
    required: [true, "CompanyID is required"],
  },
  cloudinaryDetails: { type: Object },
});

module.exports = mongoose.model("Design", DesignSchema);
