const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const newUser = new User({ ...req.body }); // Creating new User
  await newUser.save();
  const token = newUser.generateToken(); // Generating JWT

  res.status(StatusCodes.CREATED).json({
    success: true,
    user: { name: newUser.name, email: newUser.email },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide Email and Password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials provided");
  }
  const match = user.verifyPassword(password);
  if (match) {
    //Generate token
    const token = user.generateToken();
    res.status(StatusCodes.OK).json({ success: true, user, token });
  } else {
    //Send back response
    throw new UnauthenticatedError("Invalid credentials provided");
  }
};

module.exports = { register, login };
