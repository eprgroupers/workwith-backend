const mongoose = require("mongoose");
const { array } = require("../../middleware/multer-engine");

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
  image:[{
    imgURL:{
      type:String,
    },
    cloudinaryDetails:{
      type:Object
    }
  }],
 
  CompanyID: {
    type: String,
  },
  
  
});

module.exports = mongoose.model("Project", ProjectSchema);
