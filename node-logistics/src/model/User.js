const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please Enter Username"],
      unique: [true, "Please Enter unique Username"],
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
  },
  { timestamps: true, toJSON: { virtual: true } }
);

const User = mongoose.model("User", userSchema, "User");

module.exports = User;
