const deliveryVehiclesModel = require("../../model/DeliveryVehicles");

const mongoose = require("mongoose");

const { ApiResponse } = require("../../utils/response/ApiResponse");
const { ApiError } = require("../../utils/error/ApiError");
const { isEmptyString } = require("../../utils/helper/string");
const { VehicleTypeEnum } = require("../../../constants");

const create = async function (req, res) {
  try {
    const { registrationNumber, vehicleType, city } = req.body;
    if (!registrationNumber || !vehicleType || !city) {
      return res.status(422).json(new ApiError(422, "All fields are required"));
    }

    // LEARN : Show error for valid enum
    if (!VehicleTypeEnum.includes(vehicleType)) {
      return res.status(422).json(new ApiError(422, "Invalid vehicleType"));
    }

    const deliveryVehiclesObj = new deliveryVehiclesModel({
      registrationNumber,
      vehicleType,
      city,
    });

    const result = await deliveryVehiclesObj.save();

    return res
      .status(201)
      .json(new ApiResponse(201, result, "Vehicle added successfully"));
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      /** LEARN : If schema contain multiple unique key fields and we want to display field name
       *            if any error occurred related to duplicate key */
      const fieldNames = Object.keys(error.keyValue).join(", ");
      return res
        .status(409)
        .json(new ApiError(409, `Duplicate key for fields: ${fieldNames}`));
    }
    // console.log(error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const getSingleDetails = async function (req, res) {
  try {
    const { deliveryId } = req.params;

    // LEARN : To check _id in params is valid or not
    if (!mongoose.isValidObjectId(deliveryId)) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid delivery vehicle ID"));
    }

    const deliveryVehicleData = await deliveryVehiclesModel.find({
      _id: deliveryId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deliveryVehicleData,
          "Data fetched for single vehicle"
        )
      );
  } catch (error) {
    // console.log(error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const updateSingleDetails = async function (req, res) {
  try {
    const { deliveryId } = req.params;
    const { registrationNumber, vehicleType, city } = req.body;

    if (!mongoose.isValidObjectId(deliveryId)) {
      return res.status(400).json(new ApiError(400, "Invalid item ID"));
    }

    if (!registrationNumber && !vehicleType && !city) {
      return res
        .status(422)
        .json(
          new ApiError(
            422,
            "At least one field is required from [registrationNumber, vehicleType, city]"
          )
        );
    }

    if (!VehicleTypeEnum.includes(vehicleType) && vehicleType !== undefined) {
      return res
        .status(422)
        .json(
          new ApiError(
            422,
            `Invalid vehicleType, either must be ${VehicleTypeEnum.toString()} any one of them`
          )
        );
    }

    const deliveryVehicleData = await deliveryVehiclesModel.findByIdAndUpdate(
      deliveryId,
      { registrationNumber, vehicleType, city },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, deliveryVehicleData, "Data update successfully")
      );
  } catch (error) {
    // console.log(error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const getAllDeliveryVehicles = async (req, res) => {
  try {
    const allDeliveryVehicles = await deliveryVehiclesModel.find({});

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          allDeliveryVehicles,
          "All Items fetched successfully"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

module.exports = {
  create,
  getSingleDetails,
  updateSingleDetails,
  getAllDeliveryVehicles,
};
