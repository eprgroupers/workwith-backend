const express = require("express");
const router = express.Router();
const ReviewText = require("../models/review-text");
const Company = require("../models/company");
const ObjectId = require("mongoose").Types.ObjectId;
const MulterUploader = require("../../middleware/multer-engine");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

// get all companies
router.get("/", async (req, res) => {
  try {
    // get all companies from mongodb with specific feilds
    const reviewText = await ReviewText.find();
    // send data to front end with 200 status code
    res.json(reviewText).status(200);
  } catch (err) {
    // catch error
    res.send("Error " + err);
  }
});

// get random reviews
router.get("/random", async (req, res) => {
  try {
    // get all companies from mongodb with specific feilds
    const reviewText = await ReviewText.aggregate([{ $sample: { size: 7 } }]);
    // send data to front end with 200 status code
    // res.json(reviewText).status(200);
    res.json(reviewText);
  } catch (err) {
    // catch error
    res.send("Error " + err);
  }
});

// get review by id
router.get("/:id", async (req, res) => {
  let id = req.params.id;
  console.log(id);
  let Serchcompany = await Company.findOne({ _id: id });

  if (Serchcompany != null) {
    try {
      let SerchReview = await ReviewText.find({ CompanyID: id });
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


router.post("/", MulterUploader.single("profile"), async (req, res) => {
  const newReview = new ReviewText(req.body);//create object newReview and asign req.body details
  let companyId = req.body.CompanyID;


  let Serchcompany = await Company.findOne({ _id: companyId });//find company details
  console.log(Serchcompany);
  //checking company is registed
  if (Serchcompany != null) {
    try {
      //check image file value
      if (req.file !== undefined) {
        //upload cloudinary
        let imgInfo =cloudinary.uploader
          .upload(req.file.path, {
            use_filename: true,
            folder: "build-with/review-text/profile",
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
  let newReview = new ReviewText(req.body);//create object newReview and asign req.body details
  newReview._id = req.params.id;
  let companyId = req.body.CompanyID;
  let reviewText = await ReviewText.findById(req.params.id);
  let Serchcompany = await Company.findOne({ _id: companyId });//find company details
  var cloudinaryDetails = reviewText.cloudinaryDetails;
  //console.log(Serchcompany);
  //checking company is registed
  if (Serchcompany != null) {
    try {
      //check image file value
      if (req.file !== undefined) {
        if(cloudinaryDetails !==undefined){
          await cloudinary.uploader.destroy(reviewText.cloudinaryDetails.public_id);
        }
        //upload cloudinary
        //await cloudinary.uploader.destroy(reviewText.cloudinaryDetails.public_id);
        let imgInfo = cloudinary.uploader
          .upload(req.file.path, {
            use_filename: true,
            folder: "build-with/review-text/profile",
            public_id: req.file.filename,
          })
        newReview.cloudinaryDetails = await imgInfo;//add cloudinary details newReview object
        let url = (await imgInfo).url;
        newReview.ProfilePicture = url;


      }
      console.log(newReview);
      
       await ReviewText.findByIdAndUpdate(req.params.id, newReview, { new: true })
        res.json("updated....."); 
      // newReview.save();//save datebase
      // res.send(`${newReview.Name}'s review is added`);
    } catch(err) {
      res.send(err);
    }
  } else {
    res.send("No comapny registered in the name");
  }
});
module.exports = router;
