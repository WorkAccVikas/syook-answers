const itemsModel = require("../../model/Items");

const mongoose = require("mongoose");

const { ApiResponse } = require("../../utils/response/ApiResponse");
const { ApiError } = require("../../utils/error/ApiError");
const { isEmptyString } = require("../../utils/helper/string");

// create single item
const createItem = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(422).json(new ApiError(422, "All fields are required"));
    }

    // LEARN : Display invalid input error when field expect number but user pass string
    if (!name || isNaN(price)) {
      return res.status(422).json(new ApiError(422, "Invalid input"));
    }

    const itemObj = new itemsModel({
      name,
      price,
    });

    const result = await itemObj.save();
    return res
      .status(201)
      .json(new ApiResponse(201, result, "Item inserted successfully"));
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(409).json(new ApiError(409, "Duplicate item name"));
    }
    // console.log(error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

// read single item
const getSingleItemDetails = async (req, res) => {
  try {
    const { itemId } = req.params;

    // LEARN : To check _id in params is valid or not
    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(400).json(new ApiError(400, "Invalid item ID"));
    }

    const itemData = await itemsModel.find({ _id: itemId });
    return res
      .status(200)
      .json(new ApiResponse(200, itemData, "Data fetched for single item"));
  } catch (error) {
    // console.log(error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

// update single item
const updateSingleItemDetails = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, price } = req.body;
    const updateData = req.body;

    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(400).json(new ApiError(400, "Invalid item ID"));
    }

    // LEARN : Show error when we don't pass any related field to update the data
    if (!name && !price) {
      return res
        .status(422)
        .json(
          new ApiError(422, "At least one field is required from [name, price]")
        );
    }

    if (isEmptyString(name)) {
      return res.status(422).json(new ApiError(422, "Invalid input"));
    } else if (price !== undefined) {
      if (isNaN(price)) {
        return res.status(422).json(new ApiError(422, "Invalid input"));
      }
    }

    const itemData = await itemsModel.findByIdAndUpdate(itemId, updateData, {
      new: true,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, itemData, "Data update successfully"));
  } catch (error) {
    // console.log(error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

// get all items
const getAllItems = async (req, res) => {
  try {
    const allItemsData = await itemsModel.find({});

    return res
      .status(200)
      .json(
        new ApiResponse(200, allItemsData, "All Items fetched successfully")
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

module.exports = {
  createItem,
  getSingleItemDetails,
  updateSingleItemDetails,
  getAllItems,
};
