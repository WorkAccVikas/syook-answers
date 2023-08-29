const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customersSchema = new Schema(
  {
    name: {
      type: String,
    },
    city: String,
  },
  { timestamps: true, toJSON: { virtual: true } }
);

const Customers = mongoose.model("Customers", customersSchema, "Customers");

module.exports = Customers;
