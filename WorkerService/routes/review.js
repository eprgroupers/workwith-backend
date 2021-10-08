const express = require("express");
const MulterUploader = require("../../middleware/multer-engine");
const router = express.Router();
const Review = require("../models/review");
const Worker = require("../models/worker");
const ObjectId = require("mongoose").Types.ObjectId;
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

//get all reviews
router.get("/", async (req, res) => {
  try {
    const review = await Review.find();
    res.json(review).status(200);
  } catch (err) {
    res.json("Error " + err);
  }
});

// post a review
router.post("/", async (req, res) => {
  let newReview = new Review(req.body);
  let workerid = req.body.workerID;
  try {
    newReview.save();
    let update = await Worker.findOneAndUpdate(
      { _id: workerid },
      { reviewAvailable: true }
    );
    console.log(update, "review");
    res.json(newReview);
  } catch (err) {
    throw err;
  }
});

// get review for user
router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const review = await Review.find({ workerID: id });
    res.send(review);
  } catch (err) {
    console.log(err);
    res.json("Error ");
  }
});

// Delete a review`

router.patch("/blockjob", async (req, res) => {
  id = req.body.id;

  if (ObjectId.isValid(id)) {
    let editJob = await Review.findById({ _id: id });
    if (editJob === null) {
      res.status(404).send("No records found");
    } else {
      if (editJob.Activate == true) {
        editJob.Activate = false;
        try {
          editJob.save();
          res.status(200).send("successfully blocked");
        } catch {
          res.json("some error occured please try again");
        }
      } else {
        res.json("it is already in blocked list");
      }
    }
  } else {
    res.status(404).send("No job available");
  }
});
module.exports = router;
