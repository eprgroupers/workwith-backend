const mongoose = require("mongoose");

const DesignSchema = mongoose.Schema({
  Place: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Design", DesignSchema);
