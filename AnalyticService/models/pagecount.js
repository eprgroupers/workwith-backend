const mongoose = require("mongoose");

const PageCountSchema = mongoose.Schema({
  Project: {
    type: String,
    required: true,
  },
  Page: {
    type: String,
    required: true,
  },
  Count: {
    type: Number,
    default: 0,
    required: true,
  },
});

module.exports = mongoose.model("PageCount", PageCountSchema);
