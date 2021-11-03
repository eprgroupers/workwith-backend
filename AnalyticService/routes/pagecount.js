const express = require("express");
const router = express.Router();
const PageCount = require("../models/pagecount");

// get all page views
router.get("/:project", async (req, res) => {
  let Project = req.params.project.toLowerCase();
  //   let Page = req.params.page.toLowerCase();
  console.log(req.params);

  try {
    // get all companies from mongodb with specific feilds
    const pageCount = await PageCount.find(
      { Project },
      { Page: 1, Count: 1, _id: 0 }
    );
    // send data to front end with 200 status code
    res.json(pageCount).status(200);
  } catch (err) {
    // catch error
    res.send("Error " + err);
  }
});

// get page view
router.get("/:project/:page", async (req, res) => {
  let Project = req.params.project.toLowerCase();
  let Page = req.params.page.toLowerCase();
  console.log(req.params, Page);
  try {
    // get all companies from mongodb with specific feilds
    const pageCount = await PageCount.findOne(
      {
        Project,
        Page,
      },
      { Count: 1 }
    );
    // send data to front end with 200 status code
    if (pageCount == null) {
      res.send(404);
    } else {
      res.json(pageCount).status(200);
    }
  } catch (err) {
    // catch error
    res.send("Error " + err);
  }
});

router.post("/new-page", async (req, res) => {
  let Project = req.body.Project.toLowerCase();
  let Page = req.body.Page.toLowerCase();
  console.log(req.body);
  try {
    let checkPage = await PageCount.findOne({ Page, Project });
    console.log(checkPage);
    if (checkPage != null) {
      res.send("already available");
    } else {
      const newPage = new PageCount({ Page, Project });
      console.log(newPage);
      newPage.save();
      res.send(newPage);
    }
  } catch {
    console.log("error");
  }
});

router.post("/count/:Project/:Page", async (req, res) => {
  let Project = req.params.Project.toLowerCase();
  let Page = req.params.Page.toLowerCase();
  console.log(req.params, "countme");
  try {
    let CountPage = await PageCount.findOne({ Page, Project });
    if (CountPage == null) {
      res.send(`No Page is available`);
    } else {
      CountPage.Count += 1;
      console.log(CountPage);
      CountPage.save();
      res.send(`The count is ${CountPage.Count}`);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
