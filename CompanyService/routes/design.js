const express = require("express");
const router = express.Router();
const Design = require("../models/design");
const Company = require("../models/company");
const ObjectId = require("mongoose").Types.ObjectId;
const MulterUploader = require("../../middleware/multer-engine");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

// get all companies
router.get("/", async (req, res) => {
  try {
    // get all companies from mongodb with specific feilds
    const design = await Design.find();
    // send data to front end with 200 status code
    res.json(design).status(200);
  } catch (err) {
    // catch error
    res.send("Error " + err);
  }
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let Serchcompany = await Company.findOne({ _id: id });

  if (Serchcompany != null) {
    try {
      let searchDesign = await Design.find({ CompanyID: id });
      console.log(searchDesign);
      if (searchDesign != null) {
        res.send(searchDesign);
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


//create new design
router.post("/", MulterUploader.single("design-img"), async (req, res) => {
  const newDesign = new Design(req.body);//create object newDesign and asign req.body details
  let companyId = req.body.CompanyID;
  //let img = req.body.design-img;
  //console.log(img);
  let Serchcompany = await Company.findOne({ _id: companyId });//find company details
  //checking company is registed
  if (Serchcompany != null) {
    try {
      //check image file value
      if (req.file !== undefined) {
        //upload cloudinary
        let imgInfo = cloudinary.uploader
          .upload(req.file.path, {
            use_filename: true,
            folder: "build-with/design/image",
            public_id: req.file.filename,
          })
        newDesign.cloudinaryDetails = await imgInfo;//add cloudinary details newDesign object
        let url = (await imgInfo).url;//image url
        newDesign.Image = url;
      }
      newDesign.save().then(res.send(`${newDesign.Title}'s design is added`));//save database
    } catch {
      res.send("some error occured");
    }
  } else {
    res.send("No comapny registered in the name");
  }
});


//edit
router.patch("/edit-design/:id", MulterUploader.single("design-img"), async (req, res) => {
  const newDesign = new Design(req.body);//create object newDesign and asign req.body details
  let companyId = req.body.CompanyID;
  newDesign._id = req.params.id;

  let design = await Design.findById(req.params.id);
  //console.log(newDesign);
  let Serchcompany = await Company.findOne({ _id: companyId });//find company details
  // var cid ="cloudinaryDetails" in design;
  // console.log(cid);
  //checking company is registed
  if (Serchcompany != null) {
    try {
      
      //check image file value
      if (req.file !== undefined) {
        
          await cloudinary.uploader.destroy(design.cloudinaryDetails.public_id);
        //await cloudinary.uploader.destroy(design.cloudinaryDetails.public_id);
        //upload cloudinary
        let imgInfo = cloudinary.uploader
          .upload(req.file.path, {
            use_filename: true,
            folder: "build-with/design/image",
            public_id: req.file.filename,
          })
        newDesign.cloudinaryDetails = await imgInfo;//add cloudinary details newDesign object
        let url = (await imgInfo).url;//image url
        newDesign.Image = url;
      }
         await Design.findByIdAndUpdate(req.params.id, newDesign, { new: true })
         res.json(newDesign); 
    } catch {
      res.send("some error occured");
    }
  } else {
    res.send("No comapny registered in the name");
  }
});

module.exports = router;
