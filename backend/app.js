require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const videoRoute = require("./Routes/videosRoutes");
const rateLimit = require("express-rate-limit");

// DB_URI = mongodb+srv://aftabmulani1515:qtfsKMfFcipdNN1J@cluster0.1hu4gsn.mongodb.net/Clustor0

const app = express();
const POINT = process.env.NODE_ENV;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3000, // Limit each IP to 3000 requests per windowMs
});

const DB_URI = process.env.DB_URI;
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Connected to Db at, " + DB_URI);
  })
  .catch((error) => {
    console.log(error);
  });

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//User register/login route
app.use("/v1", videoRoute);

app.listen(POINT, () => {
  console.log(`Server running on port ${POINT}`);
});
