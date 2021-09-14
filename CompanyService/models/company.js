const mongoose = require("mongoose");

const CompanySchema = mongoose.Schema({
  Name: {
    type: String,
    required: [true, "Name field is required"],
  },
  WhoWeAre: {
    type: String,
    required: false,
  },
  Mission: {
    type: String,
    required: true,
  },
  Vision: {
    type: String,
    required: true,
  },
  Activate: {
    type: Boolean,
    required: true,
    default: true,
  },
  RegNumber: {
    type: String,
    required: true,
  },
  Ownership: {
    type: String,
    required: true,
  },
  ContactNo: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  Address: {
    type: String,
    required: true,
  },
  KeyFeatures: [
    {
      Feature: {
        type: String,
        required: true,
      },
      Description: {
        type: String,
        required: true,
      },
    },
  ],
  registeredOn: {
    type: Date,
    default: Date.now(),
    require: true,
  },
});

module.exports = mongoose.model("Company", CompanySchema);
