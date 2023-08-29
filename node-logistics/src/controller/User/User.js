const userModel = require("../../model/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { ApiResponse } = require("../../utils/response/ApiResponse");
const { ApiError } = require("../../utils/error/ApiError");

// register
async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(422).json(new ApiError(422, "All fields are required"));
    }

    const savedUser = await userModel.findOne({ username });

    if (!!savedUser) {
      let errorMessage = "";
      if (savedUser.username.toLowerCase() === username.toLowerCase()) {
        errorMessage = "Username already exists.";
      }

      return res.status(400).json(new ApiError(400, errorMessage));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new userModel({
      username,
      password: hashedPassword,
    });

    const result1 = await user.save();

    const result = {
      username: result1.username,
      _id: result1._id,
      createdAt: result1.createdAt,
      updatedAt: result1.updatedAt,
    };

    return res
      .status(201)
      .json(new ApiResponse(201, result, "Register Successfully"));
  } catch (error) {
    // console.log(error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
}

// login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(422).json(new ApiError(422, "All fields are required"));
    }

    const savedUser = await userModel.findOne({ username });

    if (!savedUser) {
      return res
        .status(401)
        .json(new ApiError(401, "Invalid email or password"));
    }

    // Compare password from user and password found in db

    const doMatch = await bcrypt.compare(password, savedUser.password);
    if (doMatch) {
      const token = await jwt.sign(
        { _id: savedUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      const data = {
        username: savedUser.username,
        _id: savedUser._id,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      };

      const result = {
        token,
        user: data,
      };

      return res
        .status(200)
        .json(new ApiResponse(200, result, "Login Successfully"));
    } else {
      return res
        .status(401)
        .json(new ApiError(401, "Invalid email or password"));
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

module.exports = {
  register,
  login,
};
