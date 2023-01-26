const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const storiesSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      required: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);
mongoose.model("Stories", storiesSchema);
