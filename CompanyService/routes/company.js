const express = require("express");
const router = express.Router();
const Company = require("../models/company");
const ObjectId = require("mongoose").Types.ObjectId;
const MulterUploader = require("../../middleware/multer-engine");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

// get all companies
router.get("/", async (req, res) => {
  try {
    // get all companies from mongodb with specific feilds
    const company = await Company.find(
      { Activate: true },
      {
        Name: 1,
        WhoWeAre: 1,
        RegNumber: 1,
        Ownership: 1,
        ContactNo: 1,
        logo: { url: 1 },
      }
    );
    // send data to front end with 200 status code
    res.json(company).status(200);
  } catch (err) {
    // catch error
    res.send("Error " + err);
  }
});

// get a company with id
router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    // get all companies from mongodb with specific feilds
    const company = await Company.findOne({ _id: id, Activate: true });
    // send data to front end with 200 status code
    res.json(company).status(200);
  } catch (err) {
    // catch error
    res.send("Error " + err);
  }
});

// get a company with username
router.get("/name/:username", async (req, res) => {
  let username = req.params.username;
  try {
    // get all companies from mongodb with specific feilds
    const company = await Company.findOne({
      UserName: username,
      Activate: true,
    });
    // send data to front end with 200 status code
    res.json(company).status(200);
  } catch (err) {
    // catch error
    res.send("Error " + err);
  }
});

router.get("/blockedcompany", async (req, res) => {
  try {
    const company = await Company.find({ Activate: false });

    res.json(company).status(200);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/", MulterUploader.single("logo"), async (req, res) => {
  // creating block variables
  let cloudinaryResult;

  // check whether username is available
  const name = req.body.UserName;
  const UserNameCheck = await Company.findOne(
    { UserName: name },
    { UserName: 1 }
  );

  // filter acccording to username
  if (UserNameCheck == null) {
    const newCompany = new Company(req.body);

    // check whether email is available

    const email = req.body.Email;
    const EmailCheck = await Company.findOne({ Email: email }, { UserName: 1 });

    // filter acccording to email
    if (EmailCheck == null) {
      try {
        if (req.file) {
          cloudinaryResult = await cloudinary.uploader
            .upload(req.file.path, {
              use_filename: true,
              folder: "build-with/company",
              public_id: req.file.filename,
            })
            .then(async (result) => {
              newCompany.logo = result;
            });
        } else {
          console.log(false);
        }
        newCompany.save();
        res.send(
          `${newCompany.Name} is registered under the name of ${newCompany.UserName}`
        );
      } catch {
        console.log("error");
      }
    } else {
      res.send("Email is already registered");
    }
  } else {
    res.send("username is already registered");
  }
});

router.patch("/blockcompany", async (req, res) => {
  id = req.body.id;
  console.log();
  if (ObjectId.isValid(id)) {
    let sample = await Company.findById({ _id: id });
    if (sample === null) {
      res.status(404).send("No records found");
    } else {
      if (sample.Activate == true) {
        sample.Activate = false;
        try {
          sample.save();
          res.status(200).send("successfully blocked");
        } catch {
          res.send("some error occured please try again");
        }
      } else {
        res.send("it is already in blocked list");
      }
    }
  } else {
    res.status(404).send("No company available");
  }
});

router.patch("/unblockcompany", async (req, res) => {
  //   console.log(req.body.id);
  id = req.body.id;

  if (ObjectId.isValid(id)) {
    let sample = await Company.findById({ _id: id });
    if (sample === null) {
      res.status(404).send("No records found");
    } else {
      if (sample.Activate == false) {
        sample.Activate = true;
        try {
          sample.save();
          res.status(200).send("successfully unblocked");
        } catch {
          res.send("some error occured please try again");
        }
      } else {
        res.send("It is not in blocked list");
      }
    }
  } else {
    res.status(404).send("No company available");
  }
});

module.exports = router;
