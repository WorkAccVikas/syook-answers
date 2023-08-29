const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemsSchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "Please Enter Unique Item Name"],
    },
    price: Number,
  },
  { timestamps: true, toJSON: { virtual: true } }
);

const Items = mongoose.model("Items", itemsSchema, "Items");

module.exports = Items;
