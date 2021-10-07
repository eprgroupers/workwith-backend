const express = require("express");
const router = express.Router();
const Company = require("../models/company");
const ObjectId = require("mongoose").Types.ObjectId;

// get all companies
router.get("/", async (req, res) => {
  try {
    // get all companies from mongodb with specific feilds
    const company = await Company.find(
      { Activate: true },
      {
        Name: 1,
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
    const company = await Company.findone({ _id: id, Activate: true });
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

router.post("/", async (req, res) => {
  console.log("hitted");
  const newCompany = new Company(req.body);
  console.log(newCompany);
  //   let result = newCompany.save();
  try {
    newCompany.save();
    res.send(newCompany);
  } catch {
    console.log("error");
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
