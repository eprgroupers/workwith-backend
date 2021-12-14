const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Place: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  imgURL: [
    {
      type: String,
    },
  ],
  CompanyID: {
    type: String,
  },
});

module.exports = mongoose.model("Project", ProjectSchema);
