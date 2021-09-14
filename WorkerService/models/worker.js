const mongoose = require("mongoose");

const WorkerSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true,
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
  District: {
    type: String,
    required: true,
  },
  Age: {
    type: Number,
    required: true,
  },
  WorkArea: [{ type: String }],
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
});

module.exports = mongoose.model("Worker", WorkerSchema);
