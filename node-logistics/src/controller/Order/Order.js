const orderModel = require("../../model/Order");
const deliveryVehiclesModel = require("../../model/DeliveryVehicles");

const mongoose = require("mongoose");

const { ApiResponse } = require("../../utils/response/ApiResponse");
const { ApiError } = require("../../utils/error/ApiError");
const {
  isEmptyString,
  isValidOrderNumber,
} = require("../../utils/helper/string");
const { DELIVERY_COMPLETED } = require("../../../constants");

// create order
const create = async (req, res) => {
  try {
    const { itemId } = req.body;
    const { customer_id } = req.customer;

    if (typeof itemId === "undefined") {
      return res.status(400).json(new ApiError(422, "itemId is required"));
    } else if (isEmptyString(itemId)) {
      return res.status(422).json(new ApiError(422, "Invalid itemId"));
    }

    if (!req.isVehicleAvailable) {
      return res.status(422).json(new ApiError(422, `Can't placed order`));
    }

    const assignVehicleToOrder = await deliveryVehiclesModel.findByIdAndUpdate(
      req.vehiclesDetails._id,
      { $inc: { activeOrdersCount: 1 } },
      { new: true }
    );

    const orderObj = new orderModel({
      itemId,
      customerId: customer_id,
      deliveryVehicleId: assignVehicleToOrder._id,
    });

    const orderData = await orderObj.save();

    await orderData.populate("itemId", "name price");
    await orderData.populate(
      "deliveryVehicleId",
      "registrationNumber vehicleType"
    );

    return res
      .status(200)
      .json(new ApiResponse(200, orderData, "Order Placed Successfully"));
  } catch (error) {
    // console.log(error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const updateOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    if (!isValidOrderNumber(orderNumber)) {
      return res.status(422).json(new ApiError(422, "Invalid Order Number"));
    }

    const orderData = await orderModel.findOneAndUpdate(
      { orderNumber },
      { isDelivered: DELIVERY_COMPLETED },
      { new: true }
    );

    if (!orderData) {
      return res.status(404).json(new ApiError(404, "Data not found"));
    }

    const { deliveryVehicleId } = orderData;
    await deliveryVehiclesModel.findByIdAndUpdate(
      deliveryVehicleId,
      { $inc: { activeOrdersCount: -1 } },
      { new: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, orderData, "Order delivered Successfully"));
  } catch (error) {
    // console.log(error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const getSingleOrderDetails = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    if (!isValidOrderNumber(orderNumber)) {
      return res.status(422).json(new ApiError(422, "Invalid Order Number"));
    }

    const orderData = await orderModel.findOne({ orderNumber });

    if (!orderData) {
      return res.status(404).json(new ApiError(404, "Data not found"));
    }

    await orderData.populate(
      "deliveryVehicleId",
      "registrationNumber vehicleType"
    );
    await orderData.populate("customerId", "name city");

    return res
      .status(200)
      .json(
        new ApiResponse(200, orderData, "Order Details Fetched Successfully")
      );
  } catch (error) {
    // console.log(error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const getAllOrderDetails = async (req, res) => {
  try {
    const allOrderData = await orderModel
      .find({})
      .populate("deliveryVehicleId", "registrationNumber vehicleType")
      .populate("customerId", "name city");

    return res
      .status(200)
      .json(
        new ApiResponse(200, allOrderData, "Order Details Fetched Successfully")
      );
  } catch (error) {
    // console.log(error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

module.exports = {
  create,
  updateOrder,
  getSingleOrderDetails,
  getAllOrderDetails,
};
