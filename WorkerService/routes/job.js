const express = require("express");
const MulterUploader = require("../../middleware/multer-engine");
const router = express.Router();
const Job = require("../models/job");
const ObjectId = require("mongoose").Types.ObjectId;
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

router.get("/", async (req, res) => {
  try {
    const job = await Job.find(
      {},
      {
        cloudinaryDetails: 0,
      },
      {
        sort: {
          count: -1, //Sort by Date Added DESC
        },
      }
      // $orderby: { age : -1 }
    );
    res.json(job).status(200);
  } catch (err) {
    res.send("Error " + err);
  }
});
router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const job = await Job.findById(id, {
      cloudinaryDetails: 0,
    }).exec((err, job) => {
      if (job) {
        res.json(job).status(200);
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Error " + err);
  }
});

router.post("/", MulterUploader.single("job-img"), async (req, res) => {
  if (req.file !== undefined) {
    console.log("file");
    cloudinary.uploader
      .upload(req.file.path, {
        use_filename: true,
        folder: "lkworker-jobs",
        public_id: req.file.filename,
      })
      .then(async (result) => {
        console.log(result);
        let newJob = new Job(req.body);
        newJob.cloudinaryDetails = result;
        newJob.Image = result.url;
        try {
          newJob.save();
          res.send(newJob);
        } catch {
          console.log("error");
        }
      });
  } else {
    const newJob = new Job(req.body);
    try {
      newJob.save();
      res.send(newJob.Name);
    } catch {
      res.status(500).status("some error occured");
    }
  }
});

router.patch("/blockjob", async (req, res) => {
  id = req.body.id;

  if (ObjectId.isValid(id)) {
    let editJob = await Job.findById({ _id: id });
    if (editJob === null) {
      res.status(404).send("No records found");
    } else {
      if (editJob.Activate == true) {
        editJob.Activate = false;
        try {
          editJob.save();
          res.status(200).send("successfully blocked");
        } catch {
          res.send("some error occured please try again");
        }
      } else {
        res.send("it is already in blocked list");
      }
    }
  } else {
    res.status(404).send("No job available");
  }
});
module.exports = router;
