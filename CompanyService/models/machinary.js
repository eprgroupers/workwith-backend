const mongoose = require("mongoose");

const MachinerySchema = mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Img: {
    type: String,
  },
  Features: [
    {
      type: String,
    },
  ],
  CompanyID: {
    type: String,
  },
  cloudinaryDetails: { type: Object },
});

module.exports = mongoose.model("Machinery", MachinerySchema);
