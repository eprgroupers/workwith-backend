const express = require("express");
const router = express.Router();
const ReviewVideo = require("../models/review-video");
const Company = require("../models/company");
const ObjectId = require("mongoose").Types.ObjectId;
const MulterUploader = require("../../middleware/multer-engine");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

// get all companies
router.get("/", async (req, res) => {
  try {
    // get all companies from mongodb with specific feilds
    const reviewVideo = await ReviewVideo.find();
    // send data to front end with 200 status code
    res.json(reviewVideo).status(200);
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
      let SerchReview = await ReviewVideo.find({ CompanyID: id });
      console.log(SerchReview);
      if (SerchReview != null) {
        res.send(SerchReview);
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
  const newReview = new ReviewVideo(req.body);
  let companyId = req.body.CompanyID;

  let Serchcompany = await Company.findOne({ _id: companyId });
  console.log(Serchcompany);
  if (Serchcompany != null) {
    try {
      newReview.save();
      res.send(`${newReview.Name}'s review is added`);
    } catch {
      res.send("some error occured");
    }
  } else {
    res.send("No comapny registered in the name");
  }
});

module.exports = router;
