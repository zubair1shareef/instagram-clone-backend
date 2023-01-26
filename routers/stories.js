const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("Users");
const bcrypt = require("bcrypt");
const loginCheck = require("../middleware/requireLogin");

router.post("/createstories", loginCheck, (req, res) => {
  const { photo } = req.body;
  if (!photo) {
    res.status(422).json({ error: "fill all the required fields" });
  }
  req.user.password = undefined;
  console.log(req.user);
  const stories = Stories({
    photo,
    postedBy: req.user,
  });
  stories
    .save()
    .then((result) => {
      res.json({ stories: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/stories", loginCheck, (req, res) => {
  Stories.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name pic")

    .sort("-createdAt")
    .then((stories) => {
      res.json({ stories });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
