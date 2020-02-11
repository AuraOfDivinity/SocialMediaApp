const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: 1,
        title: "First Post",
        content: "This is the first post!",
        imgUrl: "images/duck.jpg",
        creator: {
          name: "Asel"
        },
        createdAt: new Date()
      }
    ]
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed, Entered data is incorrect." });
  }

  const title = req.body.title;
  const content = req.body.content;

  const post = new Post({
    title: title,
    content: content,
    creator: { name: "Asel" },
    imageUrl: "images/duck.jpg"
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
    .catch(err => console.log(err));

  // Create post in db
};
