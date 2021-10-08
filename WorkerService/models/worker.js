const mongoose = require("mongoose");

const WorkerSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  WorkArea: {
    type: String,
  },
  UserName: {
    type: String,
    required: true,
    unique: true,
  },
  Rating: {
    type: Number,
    required: true,
    max: [5, "Cant rate more than 5"],
  },
  ContactNo: {
    type: String,
    required: true,
  },
  WhatsAppNo: {
    type: String,
    required: false,
  },
  District: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
  },
  Experience: {
    type: Number,
  },
  Age: {
    type: Number,
    required: true,
  },
  Address: {
    type: String,
    default: null,
  },
  Job: [{ type: String, required: true }],
  NICNo: {
    type: String,
    required: true,
    unique: true,
  },
  Activate: {
    type: Boolean,
    required: true,
    default: true,
  },
  WhatsAppAvailable: {
    type: Boolean,
    default: false,
  },
  ProfileImg: {
    type: String,
    default: null,
  },
  cloudinaryDetails: {
    type: Object,
  },
  views: {
    type: Number,
    default: 0,
  },
  reviewAvailable: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Worker", WorkerSchema);
