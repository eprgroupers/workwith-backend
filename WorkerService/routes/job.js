const express = require("express");
const MulterUploader = require("../../middleware/multer-engine");
const router = express.Router();
const Job = require("../models/job");
const Worker = require("../models/worker");
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
    res.json("Error " + err);
  }
});
router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let job = await Job.findOne({_id:id});
  console.log(job);
  let jobName = job.Job;
  console.log(jobName);
  let workerCount = await Worker.find({Job:jobName}).count();
  console.log(workerCount);
  try {
    const job = await Job.findById(id, {
      cloudinaryDetails: 0,
    }).exec((err, job) => {
      if (job) {
        job.count = workerCount;
        res.json(job).status(200);

      }
    });
  } catch (err) {
    console.log(err);
    res.json("Error " + err);
  }
});

router.post("/", MulterUploader.single("job-img"), async (req, res) => {
  //check whether the job is already added
  let newJob = new Job(req.body);
  let checkJob = await Job.findOne({ Job: req.body.Job });
  if (checkJob !== null) res.send("already registered");
  
  if (req.file !== undefined) {
    let imgInfo = cloudinary.uploader
      .upload(req.file.path, {
        use_filename: true,
        folder: "lkworker-jobs",
        public_id: req.file.filename,
      })
        newJob.cloudinaryDetails =await imgInfo;
        let h = (await imgInfo).url;
        newJob.Image =h;
        
  }
  try {
    newJob.save();
    res.send(newJob);
    
  } catch (err) {
    res.status(500).send("some error occured", err);
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

router.patch("/edit/:id", MulterUploader.single("job-img"), async (req, res) => {
  //check whether the job is already added
  let newJob = new Job(req.body);
  newJob._id = req.params.id;
  let job = await Job.findById(req.params.id);
  let checkJob = await Job.findOne({ Job: req.body.Job });
  if (checkJob !== null) res.send("already registered");
  var cid = job.Image;
  if (req.file !== undefined) {

    if(cid !==null){
      await cloudinary.uploader.destroy(job.cloudinaryDetails.public_id);
    }
    let imgInfo = cloudinary.uploader
      .upload(req.file.path, {
        use_filename: true,
        folder: "lkworker-jobs",
        public_id: req.file.filename,
      })
        newJob.cloudinaryDetails =await imgInfo;
        let h = (await imgInfo).url;
        newJob.Image =h;
        
  }
  try {
    await Job.findByIdAndUpdate(req.params.id, newJob, { new: true })
      res.json("updated....."); 
    
  } catch (err) {
    res.status(500).send("some error occured", err);
  }
});
module.exports = router;
