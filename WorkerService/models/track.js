const mongoose = require("mongoose");

const TrackSchema = mongoose.Schema({
  PageViews: {
    type: Number,
  },
  HomePageViews: {
    type: String,
    required: true,
  },
  CategoryPageViews: {
    type: String,
    required: true,
  },
  
});

module.exports = mongoose.model("Tracking", TrackSchema);
