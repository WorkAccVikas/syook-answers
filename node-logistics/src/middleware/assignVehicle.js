const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const deliveryVehiclesModel = require("../model/DeliveryVehicles");
const { ApiError } = require("../utils/error/ApiError");
const { MAX_ORDER } = require("../../constants");
const { getRandomNumberInRange } = require("../utils/helper/number");

module.exports = async (req, res, next) => {
  try {
    const { city } = req.customer;
    let assignRandomVehicle;
    let isVehicleAvailable = true;

    const availableVehicles = await deliveryVehiclesModel.find({
      city: { $regex: city, $options: "i" },
      activeOrdersCount: { $lt: MAX_ORDER },
    });

    const availableVehiclesCount = availableVehicles.length;

    if (availableVehiclesCount === 0) {
      isVehicleAvailable = false;
    } else if (availableVehiclesCount === 1) {
      assignRandomVehicle = availableVehicles[0];
    } else {
      const RANDOM_ID = getRandomNumberInRange(availableVehiclesCount - 1);

      assignRandomVehicle = availableVehicles[RANDOM_ID];
    }

    req.vehiclesDetails = assignRandomVehicle && {
      _id: assignRandomVehicle._id,
      registrationNumber: assignRandomVehicle.registrationNumber,
      vehicleType: assignRandomVehicle.vehicleType,
    };
    req.isVehicleAvailable = isVehicleAvailable;
    next();
  } catch (error) {
    // console.log("middleware error = ", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};
