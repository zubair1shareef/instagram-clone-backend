const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("Users");
const bcrypt = require("bcrypt");
const loginCheck = require("../middleware/requireLogin");

router.get("/user/:userId", loginCheck, (req, res) => {
  User.findOne({ _id: req.params.userId })

    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.userId })
        .populate("postedBy", "_id name")

        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "user not found" });
    });
});

router.put("/follow", loginCheck, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(442).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/unfollow", loginCheck, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(442).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/updatepic", loginCheck, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "cant upload pic" });
      }
      res.json(result);
    }
  );
});

router.post("/search-user", (req, res) => {
  let pattern = new RegExp("^" + req.body.query);
  User.find({ name: { $regex: pattern } })
    .select("_id email name pic")

    .then((user) => {
      res.json({ user });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/edituser", loginCheck, (req, res) => {
  const { name, bio, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            name,
            bio,
            password: hash,
          },
        },
        { new: true },
        (err, result) => {
          if (err) {
            return res.status(422).json({ err });
          }
          res.json(result);
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
