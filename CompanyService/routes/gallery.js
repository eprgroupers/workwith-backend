const express = require("express");
const router = express.Router();
const Gallery = require("../models/gallery");
const Company = require("../models/company");
const ObjectId = require("mongoose").Types.ObjectId;
const MulterUploader = require("../../middleware/multer-engine");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

// get all companies
router.get("/", async (req, res) => {
  try {
    // get all companies from mongodb with specific feilds
    const gallery = await Gallery.find();
    // send data to front end with 200 status code
    res.json(gallery).status(200);
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
      let searchGallery = await Gallery.find({ CompanyID: id });
      console.log(searchGallery);
      if (searchGallery != null) {
        res.send(searchGallery);
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

router.post("/", async (req, res) => {
  const newGalleryImg = new Gallery(req.body);
  let companyId = req.body.CompanyID;

  let Serchcompany = await Company.findOne({ _id: companyId });
  console.log(Serchcompany);
  if (Serchcompany != null) {
    try {
      newGalleryImg.save();
      res.send(`Your image is added`);
    } catch {
      res.send("some error occured");
    }
  } else {
    res.send("No comapany registered in the name");
  }
});

module.exports = router;
