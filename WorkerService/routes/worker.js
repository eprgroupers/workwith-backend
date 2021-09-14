const express = require("express");
const MulterUploader = require("../../middleware/multer-engine");
const router = express.Router();
const Worker = require("../models/worker");
const ObjectId = require("mongoose").Types.ObjectId;
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

router.get("/", async (req, res) => {
  try {
    const worker = await Worker.find(
      { Activate: true },
      { Name: 1, Rating: 1, Age: 1, ProfileImg: 1, UserName: 1 }
    );
    res.json(worker).status(200);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("username/:name", async (req, res) => {
  let name = req.params.name;
  try {
    const worker = await Worker.find(
      { UserName: name, Activate: true },
      {
        cloudinaryDetails: 0,
        Activate: 0,
        views: 0,
      }
    ).exec((err, worker) => {
      if (worker) {
        res.json(worker).status(200);
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Error " + err);
  }
});

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
    res.send("Error " + err);
  }
});

router.get("/blockedworker", async (req, res) => {
  try {
    const worker = await Worker.find(
      { Activate: false },
      { Name: 1, Rating: 1, Age: 1, ProfileImg: 1 }
    );
    res.json(worker).status(200);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/", MulterUploader.single("worker-img"), async (req, res) => {
  if (req.file !== undefined) {
    console.log("file");
    cloudinary.uploader
      .upload(req.file.path, {
        use_filename: true,
        folder: "work-with",
        public_id: req.file.filename,
      })
      .then(async (result) => {
        console.log(result);
        let newWorker = new Worker(req.body);
        newWorker.cloudinaryDetails = result;
        newWorker.ProfileImg = result.url;
        try {
          newWorker.save();
          res.send(newWorker);
        } catch {
          console.log("error");
        }
      });
  } else {
    const newWorker = new Worker(req.body);
    try {
      newWorker.save();
      res.send(newWorker.Name);
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
          res.status(200).send("successfully blocked");
        } catch {
          res.send("some error occured please try again");
        }
      } else {
        res.send("it is already in blocked list");
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
          res.send("some error occured please try again");
        }
      } else {
        res.send("It is not in blocked list");
      }
    }
  } else {
    res.status(404).send("No worker available");
  }
});

router.get("/username/:name", async (req, res) => {
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
