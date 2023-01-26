const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    comments: [
      {
        text: String,
        postedBy: { type: ObjectId, ref: "Users" },
      },
    ],
    likes: [{ type: ObjectId, ref: "Users" }],
    postedBy: {
      type: ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);
mongoose.model("Post", postSchema);
