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

//create new review
router.post("/", MulterUploader.single("profile"), async (req, res) => {
  const newReview = new ReviewVideo(req.body);//create object newReview and asign req.body details
  let companyId = req.body.CompanyID;

  let Serchcompany = await Company.findOne({ _id: companyId });//find company details
  console.log(Serchcompany);

  //checking company is registed
  if (Serchcompany != null) {
    try {
      //check image file value
      if (req.file !== undefined) {
        //upload cloudinary
        let imgInfo = cloudinary.uploader
          .upload(req.file.path, {
            use_filename: true,
            folder: "build-with/review-video/profile",
            public_id: req.file.filename,
          })
        newReview.cloudinaryDetails = await imgInfo;//add cloudinary details newReview object
        let url = (await imgInfo).url;
        newReview.ProfilePicture = url;


      }
      newReview.save();//save datebase
      res.send(`${newReview.Name}'s review is added`);
    } catch {
      res.send("some error occured");
    }
  } else {
    res.send("No comapny registered in the name");
  }
});


router.patch("/edit/:id", MulterUploader.single("profile"), async (req, res) => {
  const newReview = new ReviewVideo(req.body);//create object newReview and asign req.body details
  newReview._id = req.params.id;
  let companyId = req.body.CompanyID;
  let reviewVideo = await ReviewVideo.findById(req.params.id);
  let Serchcompany = await Company.findOne({ _id: companyId });//find company details
  //console.log(Serchcompany);
  var cloudinaryDetails = reviewVideo.cloudinaryDetails;
  //checking company is registed
  if (Serchcompany != null) {
    try {
      //check image file value
      if (req.file !== undefined) {
        
        if(cloudinaryDetails !==undefined){
          await cloudinary.uploader.destroy(reviewVideo.cloudinaryDetails.public_id);
        }
      
        //upload cloudinary
        let imgInfo = cloudinary.uploader
          .upload(req.file.path, {
            use_filename: true,
            folder: "build-with/review-video/profile",
            public_id: req.file.filename,
          })
        newReview.cloudinaryDetails = await imgInfo;//add cloudinary details newReview object
        let url = (await imgInfo).url;
        newReview.ProfilePicture = url;


      }
      await ReviewVideo.findByIdAndUpdate(req.params.id, newReview, { new: true })
      res.json("updated....."); 
    } catch {
      res.send("some error");
    }
  } else {
    res.send("No comapny registered in the name");
  }
});

module.exports = router;
