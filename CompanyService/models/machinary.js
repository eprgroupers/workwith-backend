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
  Description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Machinery", MachinerySchema);
