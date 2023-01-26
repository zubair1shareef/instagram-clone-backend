const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const loginCheck = require("../middleware/requireLogin");
const User = mongoose.model("Users");
const Stories = mongoose.model("Stories");

router.get("/allpost", (req, res) => {
  Post.find()
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/followpost", loginCheck, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createpost", loginCheck, (req, res) => {
  const { title, body, photo } = req.body;
  if (!title || !body || !photo) {
    res.status(422).json({ error: "fill all the fields" });
  }
  req.user.password = undefined;
  console.log(req.user);
  const post = Post({
    title,
    body,
    photo,
    postedBy: req.user,
  });
  req.user.password = "";
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/post", (req, res) => {
  Post.find()
    .populate("postedBy", "_id name email")
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/mypost", loginCheck, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((post) => {
      res.json({ mypost: post });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", loginCheck, (req, res) => {
  console.log(req.user_id);
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/unlike", loginCheck, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/comment", loginCheck, (req, res) => {
  console.log(req.user_id);
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name ")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletepost/:postId", loginCheck, (req, res) => {
  Post.findOne({ _id: req.params.postId })

    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json({ result });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});
router.post("/createstories", loginCheck, (req, res) => {
  const { photo } = req.body;
  if (!photo) {
    res.status(422).json({ error: "fill all the fields" });
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

// router.get("/user/:id",loginCheck,(req,res)=>{
//     User.findOne({_id:req.params.id})

//     .then(user=>{
//         Post.find({postedBy:req.params.userId})
//         .populate('postedBy',"_id name")
//         .exec((err,posts)=>{
//             console.log(user)
//             if(err){
//                 return res.status(422).json({error:err})
//             }
//             res.json({user,posts})
//         })

//     }).catch(err=>{
//         return res.status(404).json({error:"user not found"})
//     })
// })
module.exports = router;
