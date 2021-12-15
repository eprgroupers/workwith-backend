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

router.post("/", async (req, res) => {
  const newDesign = new Design(req.body);
  let companyId = req.body.CompanyID;

  let Serchcompany = await Company.findOne({ _id: companyId });
  if (Serchcompany != null) {
    try {
      newDesign.save().then(res.send(`${newDesign.Place}'s design is added`));
    } catch {
      res.send("some error occured");
    }
  } else {
    res.send("No comapny registered in the name");
  }
});

module.exports = router;
