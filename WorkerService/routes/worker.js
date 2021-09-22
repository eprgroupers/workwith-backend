const express = require("express");
const MulterUploader = require("../../middleware/multer-engine");
const router = express.Router();
const Worker = require("../models/worker");
const Job = require("../models/job");
const ObjectId = require("mongoose").Types.ObjectId;
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

router.use("/review", require("./review"));
// Get all workers list
router.get("/", async (req, res) => {
  try {
    const worker = await Worker.find(
      { Activate: true },
      { Name: 1, Rating: 1, Age: 1, ProfileImg: 1, UserName: 1 }
    );
    res.json(worker).status(200);
  } catch (err) {
    res.json("Error " + err);
  }
});
// search result
router.get("/search", async (req, res) => {
  let district = req.query.district;
  let job = req.query.job;
  try {
    const worker = await Worker.find(
      { Activate: true, District: district, Job: job },
      { Name: 1, Rating: 1, Age: 1, ProfileImg: 1, UserName: 1 }
    );
    res.json(worker).status(200);
  } catch (err) {
    res.json("Error " + err);
  }
});

//filter result
router.get("/filter", async (req, res) => {
  let district = req.query.district;
  let job = req.query.job;
  try {
    const worker = await Worker.find(
      { Activate: true, District: district, Job: job },
      { Name: 1, Rating: 1, Age: 1, ProfileImg: 1, UserName: 1 }
    );
    res.json(worker).status(200);
  } catch (err) {
    res.json("Error " + err);
  }
});

// search by username
router.get("/username/:name", async (req, res) => {
  let name = req.params.name;
  try {
    let editWorker = await Worker.findOne(
      { UserName: name, Activate: true },
      {
        cloudinaryDetails: 0,
        Activate: 0,
      }
    );
    if (editWorker === null) {
      res.status(404).send("No records found");
    } else {
      try {
        editWorker.views = editWorker.views + 1;
        await editWorker.save();
        res.status(200).json(editWorker);
      } catch (err) {
        console.log(err);
        res.status(404);
        res.json("it is already in blocked list");
      }
    }
  } catch (err) {
    console.log(err);
    res.json("Error " + err);
  }
});

//get worker by username
router.get("/check/username/:name", async (req, res) => {
  let name = req.params.name;
  let findedWorker;
  try {
    let editWorker = await Worker.findOne({ UserName: name });
    if (editWorker === null) {
      res.status(404).send("UserName is not Available");
    } else {
      console.log(editWorker.views);

      res.json("it is already in blocked list");
    }
  } catch (err) {
    console.log(err);
    res.json("Error " + err);
  }
});
// search by id
router.get("/id/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const worker = await Worker.findById(id, {
      cloudinaryDetails: 0,
      Activate: 0,
      views: 0,
    }).exec((err, worker) => {
      if (worker) {
        res.json(worker).status(200);
      }
    });
  } catch (err) {
    console.log(err);
    res.json("Error " + err);
  }
});

// get all blocked workers list
router.get("/blockedworker", async (req, res) => {
  try {
    const worker = await Worker.find(
      { Activate: false },
      { Name: 1, Rating: 1, Age: 1, ProfileImg: 1 }
    );
    res.json(worker).status(200);
  } catch (err) {
    res.json("Error " + err);
  }
});

// Add a worker
router.post("/", MulterUploader.single("worker-img"), async (req, res) => {
  if (req.file !== undefined) {
    cloudinary.uploader
      .upload(req.file.path, {
        use_filename: true,
        folder: "work-with",
        public_id: req.file.filename,
      })
      .then(async (result) => {
        let newWorker = new Worker(req.body);
        newWorker.cloudinaryDetails = result;
        newWorker.ProfileImg = result.url;
        try {
          // newWorker.save();
          let editJob = await Job.findOne({ Job: req.body.Job });

          if (editJob === null) {
            res.status(404).send("No records found");
          } else {
            editJob.count = editJob.count + 1;
            console.log(editJob.count);
            newWorker.save();
            editJob.save();
            res.json(newWorker.Name);
          }

          // res.json(newWorker);
        } catch (err) {
          // console.log("error");
          console.log(err);
        }
      });
  } else {
    const newWorker = new Worker(req.body);
    try {
      // newWorker.save();
      let editJob = await Job.findOne({ Job: req.body.Job });

      if (editJob === null) {
        res.status(404).send("No records found");
      } else {
        editJob.count = editJob.count + 1;
        console.log(editJob.count);
        newWorker.save();
        editJob.save();
        res.json(newWorker.Name);
      }

      // res.json(newWorker);
    } catch {
      res.status(500).status("some error occured");
    }
  }
});

router.patch("/blockworker", async (req, res) => {
  id = req.body.id;

  if (ObjectId.isValid(id)) {
    let editWorker = await Worker.findById({ _id: id });
    if (editWorker === null) {
      res.status(404).send("No records found");
    } else {
      if (editWorker.Activate == true) {
        editWorker.Activate = false;
        try {
          editWorker.save();
          res.status(200).json("successfully blocked");
        } catch {
          res.json("some error occured please try again");
        }
      } else {
        res.json("it is already in blocked list");
      }
    }
  } else {
    res.status(404).send("No worker available");
  }
});

router.patch("/unblockworker", async (req, res) => {
  //   console.log(req.body.id);
  id = req.body.id;

  if (ObjectId.isValid(id)) {
    let editWorker = await Worker.findById({ _id: id });
    if (editWorker === null) {
      res.status(404).send("No records found");
    } else {
      if (editWorker.Activate == false) {
        editWorker.Activate = true;
        try {
          editWorker.save();
          res.status(200).send("successfully unblocked");
        } catch {
          res.json("some error occured please try again");
        }
      } else {
        res.json("It is not in blocked list");
      }
    }
  } else {
    res.status(404).send("No worker available");
  }
});

// check whether username available
router.get("/by-username/:name", async (req, res) => {
  const name = req.params.name;
  Worker.findOne({ UserName: new RegExp("^" + name + "$", "i") }).then(
    (result) => {
      if (result !== null) {
        console.log(name);
        res.status(404).send(`UserName is Already Registered`);
      } else {
        console.log("done1");

        res.status(200).send(`lkworker.me/${name} is available`);
      }
    }
  );

  // console.log(doc.Name);
});

module.exports = router;
