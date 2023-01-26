const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default:
      "https://cdn2.iconfinder.com/data/icons/font-awesome/1792/user-512.png",
  },
  followers: [
    {
      type: ObjectId,
      ref: "Users",
    },
  ],
  following: [
    {
      type: ObjectId,
      ref: "Users",
    },
  ],
  bio: {
    type: String,
    default: "enter bio here",
  },
});
mongoose.model("Users", userSchema);
