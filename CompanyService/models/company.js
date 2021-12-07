const mongoose = require("mongoose");

const CompanySchema = mongoose.Schema({
  Name: {
    type: String,
    required: [true, "Name field is required"],
  },
  UserName: {
    type: String,
    required: [true, "UserName is required"],
  },
  Description: {
    type: String,
    required: [true],
  },
  WhoWeAre: {
    type: String,
  },
  Mission: {
    type: String,
  },
  Vision: {
    type: String,
  },
  Activate: {
    type: Boolean,
    required: true,
    default: true,
  },
  RegNumber: {
    type: String,
  },
  Ownership: [{ type: String }],
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
  Rating: {
    type: Number,
    required: true,
    max: [10, "Cant rate more than 5"],
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
    immutable: true,
  },
  logo: {
    type: Object,
    default: null,
  },
});

module.exports = mongoose.model("Company", CompanySchema);
