const mongoose = require("mongoose");
const { VehicleTypeEnum, MAX_ORDER } = require("../../constants");
const Schema = mongoose.Schema;

const deliveryVehiclesSchema = new Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, "Please Enter Registration Number"],
      unique: [true, "Please Enter Unique Registration Number"],
    },
    vehicleType: {
      type: String,
      enum: VehicleTypeEnum,
    },
    city: String,
    activeOrdersCount: {
      type: Number,
      default: 0,
      max: [MAX_ORDER, "Busy"],
    },
  },
  { timestamps: true, toJSON: { virtual: true } }
);

const DeliveryVehicles = mongoose.model(
  "DeliveryVehicles",
  deliveryVehiclesSchema,
  "DeliveryVehicles"
);

module.exports = DeliveryVehicles;
