const express = require("express");
const router = express.Router();
const Gallery = require("../models/gallery");
const Company = require("../models/company");
const ObjectId = require("mongoose").Types.ObjectId;
const MulterUploader = require("../../middleware/multer-engine");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

// get all companies
router.get("/", async (req, res) => {
  try {
    // get all companies from mongodb with specific feilds
    const gallery = await Gallery.find();
    // send data to front end with 200 status code
    res.json(gallery).status(200);
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
      let searchGallery = await Gallery.find({ CompanyID: id });
      console.log(searchGallery);
      if (searchGallery != null) {
        res.send(searchGallery);
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


//create new gallery image
router.post("/", MulterUploader.single("ImgURL"), async (req, res) => {
  const newGalleryImg = new Gallery(req.body);//create object newGalleryImg and asign req.body details
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
            folder: "build-with/gallery/image",
            public_id: req.file.filename,
          })
        newGalleryImg.cloudinaryDetails = await imgInfo;//add cloudinary details newGalleryImg object
        let url = (await imgInfo).url;
        newGalleryImg.ImgURL = url;
        console.log(imgInfo);

        newGalleryImg.save()//save database
          .then(res.send(`Your image is added`));

      }else{
        res.send("Please add an Image");
      }

    } catch {
      res.send("some error occured");
    }
  } else {
    res.send("No comapany registered in the name");
  }
});

router.patch("/edit/:id", MulterUploader.single("ImgURL"), async (req, res) => {
  const newGalleryImg = new Gallery(req.body);//create object newGalleryImg and asign req.body details
  let companyId = req.body.CompanyID;
  newGalleryImg._id = req.params.id;
  let gallery = await Gallery.findById(req.params.id);
  let Serchcompany = await Company.findOne({ _id: companyId });//find company details
  console.log(Serchcompany);

  //checking company is registed
  if (Serchcompany != null) {
    try {
      //check image file value
      if (req.file !== undefined) {
        //upload cloudinary
        await cloudinary.uploader.destroy(gallery.cloudinaryDetails.public_id);
        let imgInfo = cloudinary.uploader
          .upload(req.file.path, {
            use_filename: true,
            folder: "build-with/gallery/image",
            public_id: req.file.filename,
          })
        newGalleryImg.cloudinaryDetails = await imgInfo;//add cloudinary details newGalleryImg object
        let url = (await imgInfo).url;
        newGalleryImg.ImgURL = url;
        console.log(imgInfo);

        await Gallery.findByIdAndUpdate(req.params.id, newGalleryImg, { new: true })
        res.json("updated....."); 

      } else{
        res.send("Please add an Image");
      }

    } catch {
      res.send("some error occured");
    }
  } else {
    res.send("No comapany registered in the name");
  }
});

module.exports = router;
