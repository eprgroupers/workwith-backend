const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
// const path = require("path");
// const cookieSession = require("cookie-session");
require("dotenv").config();

const CompanyRouter = require("./CompanyService/routes/company");
const ReviewTextRouter = require("./CompanyService/routes/review-text");
const WorkerRouter = require("./WorkerService/routes/worker");
const jobRouter = require("./WorkerService/routes/job");

const userRoutes = require("./AuthService/routes/userRoutes");
const resetPassword = require("./AuthService/routes/resetRoutes");
const forgetPasswordRoutes = require("./AuthService/routes/forgetPasswordRoutes");
const checkIdentity = require("./AuthService/routes/checkIdentity");
const PageCount = require("./AnalyticService/routes/pagecount");
const CallCount = require("./AnalyticService/routes/callCount");
const mongouri =
  "mongodb+srv://eprgroupers:eprgroupers@cluster0.5jlys.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// "mongodb+srv://sample:sample@cluster0.sozug.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// "mongodb://localhost:27017/buildwith";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
// app.use(cors({ origin: process.env.client, withCredentials: true }));
app.use(cors());
app.use("/auth", userRoutes);
app.use("/account", resetPassword);
app.use("/forget-password", forgetPasswordRoutes);
app.use("/check-identity", checkIdentity);
app.use("/page-count", PageCount);
app.use("/call-count", CallCount);
// app.use("/update-profile", updateProfile);
app.get("/", (req, res) => {
  res.send("Welcome to BuildWith ");
});

// Conpany Service
app.use("/company", CompanyRouter);
app.use("/review-t", ReviewTextRouter);

// Worker Service
app.use("/worker", WorkerRouter);
app.use("/job", jobRouter);

const uri = process.env.MONGO_URI;
const PORT = process.env.PORT || 8080;
let connection = mongoose.connect(mongouri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
connection
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection established");

      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("connection failed", err);
  });
