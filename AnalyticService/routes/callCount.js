const express = require("express");
const router = express.Router();
const CallCount = require("../models/callCount");

// get all call counts
router.get("/", async (req, res) => {
  try {
    // get all companies from mongodb with specific feilds
    const callCounts = await CallCount.find({}, { _id: 0 });
    // send data to front end with 200 status code
    res.json(callCounts).status(200);
  } catch (err) {
    // catch error
    res.send("Error " + err);
  }
});

router.post("/count/:id", async (req, res) => {
  let id = req.params.id;
  console.log("helo");
  try {
    let WorkerCount = await CallCount.findOne({ WorkerID: id });
    if (WorkerCount == null) {
      let callCount = new CallCount({ WorkerID: id });
      callCount.save();
      res.send(`The count is ${callCount.Count}`);
    } else {
      WorkerCount.Count += 1;
      WorkerCount.save();
      res.send(`The count is ${WorkerCount.Count}`);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
