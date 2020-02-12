const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const uuidv4 = require("uuid/v4");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

const fileStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "images");
  },
  filename: function(req, file, cb) {
    cb(null, uuidv4());
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// Serving the images statically.
app.use("/images", express.static(path.join(__dirname, "images")));

// Adding the cross origin resource sharing headers (This could be done through the cors library as well)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use("/auth", authRoutes);

// Error handling middleware - Handling errors used in async code snippets in a single middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;

  res.status(status);
  res.json({ message: message });
});

// Connecting to the mongoose server. Note the 'messages' database name to which the
mongoose
  .connect(
    "mongodb+srv://asel123:asel123@socialmediaappcluster-leoir.mongodb.net/messages?retryWrites=true&w=majority"
  )
  .then(result =>
    app.listen(8080, _ => {
      console.log("server listening at port 8080");
    })
  )
  .catch(err => console.log(err));
