const jwt = require("jsonwebtoken");
const userModel = require("../model/User");
const { ApiError } = require("../utils/error/ApiError");

// middleware for check valid user and its token
module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Authorization not present in headers
    if (!authorization) {
      return res
        .status(401)
        .json(new ApiError(401, "You must be logged in !!!"));
    }

    const token = authorization.split(" ")[1];

    try {
      //  Decode jwt token
      let decodeToken = await jwt.verify(token, process.env.JWT_SECRET);

      // destructor _id from decodeToken
      const { _id } = decodeToken;

      // Find user data by _id in jwt token
      const userData = await userModel.findById({ _id }).select("-password");

      if (!userData) {
        return res.status(422).json(new ApiError(422, `Can't find User`));
      }

      req.user = userData;
      next();
    } catch (error) {
      return res.status(401).json(new ApiError(401, "Invalid Token"));
    }
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};
