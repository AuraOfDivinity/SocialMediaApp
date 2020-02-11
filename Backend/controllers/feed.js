const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  // find will return all the objects stored in the database
  Post.find()
    .then(posts => {
      res.status(200).json({
        message: "Fetched posts successfully",
        posts: posts
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, Entered data is incorrect.");
    error.statusCode = 422;
    throw error;

    // Throwing the error will exit the function execeution and will try to reach the next error handling middleware or the function
  }
  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path.replace("\\", "/");
  const title = req.body.title;
  const content = req.body.content;

  const post = new Post({
    title: title,
    content: content,
    creator: { name: "Asel" },
    imageUrl: imageUrl
  });

  // Post save allows to save the object to database in the cluster
  post
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Post created successfully!",
        post: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      // Throwing an error would not work here because we are in an asynchronous code snippet. Instead we have to use the next function here and pass the error to the next error handling middleware. (check the error handling middleware in the app.js)
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  // Note the params."postId" parameter must match the exact one that is mentione din the route after the colon.
  const postId = req.params.postId;

  // Using the post model to find a post with the same id in the database
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error("Could not find post");
        throw error;
      }
      res.status(200).json({
        message: "Post fetched",
        post: post
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
