const mongoose = require("mongoose");

const GallerySchema = mongoose.Schema({
  ImgURL: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  CompanyID: {
    type: String,
    required: [true, "CompanyID is required"],
  },
   cloudinaryDetails: { type: Object },
});

module.exports = mongoose.model("Gallery", GallerySchema);
