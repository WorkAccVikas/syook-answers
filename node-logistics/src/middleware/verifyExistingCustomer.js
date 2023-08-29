const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const customersModel = require("../model/Customers");
const { ApiError } = require("../utils/error/ApiError");
const { isEmptyString } = require("../utils/helper/string");

// middleware for check valid user and its token
module.exports = async (req, res, next) => {
  try {
    const { customerId, customer_name, customer_city } = req.body;
    let isExistingCustomer;
    let city;
    let customer_id;

    if (isEmptyString(customerId)) {
      return res.status(400).json(new ApiError(400, "Invalid customer Id"));
    }

    if (!customerId) {
      const customerObj = new customersModel({
        name: customer_name,
        city: customer_city,
      });

      const customerData = await customerObj.save();

      isExistingCustomer = false;
      city = customer_city;
      customer_id = customerData._id;
    } else {
      if (!mongoose.isValidObjectId(customerId)) {
        return res.status(400).json(new ApiError(400, "Invalid customer ID"));
      }

      // check customer exist or not
      const checkExist = await customersModel.findOne({ _id: customerId });
      isExistingCustomer = true;
      city = checkExist.city;
      customer_id = checkExist._id;
    }
    req.customer = {
      isExistingCustomer,
      city,
      customer_id,
    };
    next();
  } catch (error) {
    // console.log("middleware error = ", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};
