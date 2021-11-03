const mongoose = require("mongoose");

const CallCountSchema = mongoose.Schema({
  WorkerID: {
    type: String,
    required: true,
  },
  Count: {
    type: Number,
    default: 0,
    required: true,
  },
});

module.exports = mongoose.model("CallCount", CallCountSchema);
