const express = require("express");
const router = express.Router();
const Machinary = require("../models/machinary");
const Company = require("../models/company");
const ObjectId = require("mongoose").Types.ObjectId;
const MulterUploader = require("../../middleware/multer-engine");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

// get all companies
router.get("/", async (req, res) => {
  try {
    // get all companies from mongodb with specific feilds
    const machinary = await Machinary.find();
    // send data to front end with 200 status code
    res.json(machinary).status(200);
  } catch (err) {
    // catch error
    res.send("Error " + err);
  }
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  console.log(id);
  let Serchcompany = await Company.findOne({ _id: id });

  if (Serchcompany != null) {
    try {
      let searchMachinary = await Machinary.find({ CompanyID: id });
      console.log(searchMachinary);
      if (searchMachinary != null) {
        res.send(searchMachinary);
      } else {
        res.send("No review found");
      }
    } catch {
      res.send("some error occured");
    }
  } else {
    res.send("No comapny registered in the name");
  }
});


//create new machine
router.post("/", MulterUploader.single("machinary-img"), async (req, res) => {
  const newMachine = new Machinary(req.body);//create object newMachine and asign req.body details
  let companyId = req.body.CompanyID;

  let Serchcompany = await Company.findOne({ _id: companyId });//find company details
  console.log(Serchcompany);

  //checking company is registed
  if (Serchcompany != null) {
    try {
      //check image file value
      if (req.file !== undefined) {
        //upload cloudinary
        let imgInfo = cloudinary.uploader
          .upload(req.file.path, {
            use_filename: true,
            folder: "build-with/machinary/image",
            public_id: req.file.filename,
          })
        newMachine.cloudinaryDetails = await imgInfo;//add cloudinary details newMachine object
        let url = (await imgInfo).url;
        newMachine.Img = url;


      }
      newMachine.save();//save database
      res.send(`${newMachine.Name}  is added`);
    } catch {
      res.send("some error occured");
    }
  } else {
    res.send("No company registered in the name");
  }
});

module.exports = router;
