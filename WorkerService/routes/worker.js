const express = require("express");
const MulterUploader = require("../../middleware/multer-engine");
const router = express.Router();
const Worker = require("../models/worker");
const Job = require("../models/job");
const ObjectId = require("mongoose").Types.ObjectId;
const cloudinary = require("cloudinary").v2;


cloudinary.config(process.env.CLOUDINARY_URL);

//route to review
router.use("/review", require("./review"));

// Get all workers list
router.get("/", async (req, res) => {
  try {
    const worker = await Worker.find(
      { Activate: true },
      {
        Name: 1,
        Rating: 1,
        Experience: 1,
        ProfileImg: 1,
        UserName: 1,
        Address: 1,
        UserNameCount: 1,
      }
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
    const worker = await Worker.aggregate([
      { $match: { Activate: true, District: district, Job: job } },
      {
        $project: {
          Name: 1,
          Rating: 1,
          Experience: 1,
          ProfileImg: 1,
          UserName: 1,
          Address: 1,
          UserNameCount: 1,
        },
      },
      { $sample: { size: 30 } },
    ]);
    res.json(worker).status(200);
  } catch (err) {
    res.json("Error " + err);
  }
});

router.get("/searchbyname", async (req, res) => {
  let name = req.query.username;
  try {
    const worker = await Worker.find(
      { UserName: name },
      {
        Name: 1,
        Rating: 1,
        Experience: 1,
        ProfileImg: 1,
        UserName: 1,
        Address: 1,
        UserNameCount: 1,
      }
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

router.get("/username/:name/:number", async (req, res) => {
  let name = req.params.name;
  let numb = req.params.number;
  try {
    let editWorker = await Worker.findOne(
      { UserName: name, Activate: true, UserNameCount: numb },
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
    console.log(id);
    const worker = await Worker.findById(id, {
      cloudinaryDetails: 0,
      Activate: 0,
      views: 0,
    }).exec((err, worker) => {
      console.log(worker);
      if (worker) {
        res.json(worker).status(200);
      } else {
        console.log(err, "here");
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
  let newWorker = new Worker(req.body);

let userNameCheck = await Worker.findOne({UserName:req.body.UserName})
   .sort({UserNameCount:-1})
   .limit(1)

  //check NIC Available
  if(userNameCheck != null){
let uc =await userNameCheck.UserNameCount +1;
 newWorker.UserNameCount =uc;
  }
  let checkNIC = await Worker.findOne({ NICNo: req.body.NICNo });
  if (checkNIC !== null) {
    //if Nic already registered
    res.send("NIC already registered");
  } else {
    if (req.file !== undefined) {
      cloudinary.uploader
        .upload(req.file.path, {
          use_filename: true,
          folder: "work-with",
          public_id: req.file.filename,
        })
        .then(async (result) => {
          newWorker.cloudinaryDetails = result;
          newWorker.ProfileImg = result.url;
          try {
           
            newWorker.save((err, res) => {
              res.Job.map((job) => {
                console.log(job);
              });
            });
            // newWorker.save();
            let editJob = await Job.findOne({ Job: req.body.Job });
            if (editJob === null) {
              res.status(404).send("No Job records found");
            } else {
              editJob.count = editJob.count + 1;
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
      try {
      
        newWorker.save((err, response) => {
          if (err) {
            res.send(err);
            console.log(err);
          } else {
            response.Job.map(async (job) => {
              let editJob = await Job.findOne({ Job: job });
              if (editJob === null) {
                res.status(404).send("No job records found");
              } else {
                editJob.count = editJob.count + 1;
                editJob.save();
              }
            });
            res.json(newWorker.Name);
          }
        });

        // res.json(newWorker);
      } catch {
        res.status(500).status("some error occured");
      }
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

        res.status(200).send(`workwith.me/${name} is available`);
      }
    }
  );

  
});


//update worker 
router.patch("/edit/:id", MulterUploader.single("worker-img"), async (req, res) => {
  let existWorker =await Worker.findOne({_id:req.params.id});
  let name =  existWorker.UserName;
  let newWorker = new Worker(req.body);
  console.log(newWorker);
 
  
let userNameCheck = await Worker.findOne({UserName:req.body.UserName})
.sort({UserNameCount:-1})
.limit(1)

  if(name != req.body.UserName){
    if(userNameCheck.length != 0){
      let uc =await userNameCheck.UserNameCount +1;
      newWorker.UserNameCount =uc;
       }
}else{
  newWorker.UserNameCount = existWorker.UserNameCount;
}
  // check whether img is available to upload

  //check NIC Available

  let checkNIC = await Worker.findOne({ NICNo: req.body.NICNo });
  let check = await Worker.findOne({ _id: req.params.id });
  //let existNic = await;
  //console.log(existNic);
  if (checkNIC == null ||  check.NICNo === req.body.NICNo) {
    newWorker._id = req.params.id;
   // newWorker.NICNo = req.body.NICNo;
    //newWorker.NICNo = existNic;
    if (req.file !== undefined) {
      cloudinary.uploader
        .upload(req.file.path, {
          use_filename: true,
          folder: "work-with",
          public_id: req.file.filename,
        })
        .then(async (result) => {
          newWorker.cloudinaryDetails = result;
          newWorker.ProfileImg = result.url;
         
          try {
            
            await Worker.findByIdAndUpdate(req.params.id, newWorker, { new: true });
             res.json("updated....."); 
            // newWorker.save();
            let editJob = await Job.findOne({ Job: req.body.Job });
            if (editJob === null) {
              res.status(404).send("No Job records found");
            } else {
              editJob.count = editJob.count + 1;
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
        await Worker.findByIdAndUpdate(req.params.id, newWorker, { new: true });
        res.json("updated....."); 
              let job = newWorker.Job;
              let editJob = await Job.findOne({ Job: job });
              if (editJob === null) {
                res.status(404).send("No job records found");
              } else {
                editJob.count = editJob.count + 1;
                editJob.save();
              }

        // res.json(newWorker);
      
    }
   
  } else {
    //if Nic already registered
    res.send("NIC already registered");
  }
});


module.exports = router;



