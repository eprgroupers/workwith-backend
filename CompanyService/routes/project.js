const express = require("express");
const router = express.Router();
const Project = require("../models/project");
const Company = require("../models/company");
const ObjectId = require("mongoose").Types.ObjectId;
const MulterUploader = require("../../middleware/multer-engine");
const cloudinary = require("cloudinary").v2;
const { array } = require("../../middleware/multer-engine");
cloudinary.config(process.env.CLOUDINARY_URL);

// get all companies
router.get("/", async (req, res) => {
  try {
    // get all companies from mongodb with specific feilds
    const project = await Project.find();
    // send data to front end with 200 status code
    res.json(project).status(200);
  } catch (err) {
    // catch error
    res.send("Error " + err);
  }
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  console.log(id);
  let Serchcompany = await Company.findOne({ _id: id });

  if (Serchcompany != null) {
    try {
      let seacrchProject = await Project.find({ CompanyID: id });
      console.log(seacrchProject);
      if (seacrchProject != null) {
        res.send(seacrchProject);
      } else {
        res.send("No review found");
      }
    } catch {
      res.send("some error occured");
    }
  } else {
    res.send("No comapny registered in the name");
  }
});

//create new project
router.post("/", MulterUploader.array('project-img', 12), async (req, res, next) => {
  const newProject = new Project(req.body);//create object newProject and asign req.body details
  let companyId = req.body.CompanyID;
    var imageDetails = [];
  let Serchcompany = await Company.findOne({ _id: companyId });//find company details
  console.log(Serchcompany);

  //checking company is registed
  if (Serchcompany != null) {
    try {
      var arrayLenght = req.files.length;//get number of files there
      //check image file value
      if (req.files !== undefined) {
        //check files length morethan 3?
        if (arrayLenght > 3) {
          console.log(arrayLenght);
          //loop files/images
          for (var i = 0; i < req.files.length; i++) {
            var locaFilePath = req.files[i].path;//get file localpath
            var result = await cloudinary.uploader.upload(locaFilePath);//upload cloudinary
            
            let imgObj  = new Object;
            imgObj.imgURL = result.url;
            imgObj.cloudinaryDetails=result;

            imageDetails[i] = imgObj;
           
          }
          console.log(imageDetails);
          newProject.image = imageDetails;
          newProject.save();//save database
          res.send(`${newProject.Title} Project is added`);
        } else {
          res.send("please add morethan 3 images");
        }
      }
    } catch {
      res.send("some error occured");
    }

  } else {
    res.send("No company registered in the name");
  }
});

module.exports = router;
