const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
require("dotenv").config();
const User = require("../models/User");

const authenticationMiddleware = async (req, res, next) => {
  //check header
  const { authorization } = req.headers;
  // check if authorization property is valid
  if (!authorization || !authorization.startsWith("Bearer")) {
    throw new UnauthenticatedError("Token not provided");
  }
  const token = authorization.split(" ")[1]; //Getting hold of the JWT
  try {
    const userPayload = jwt.verify(token, process.env.JWT_SECRET); // Verifying JWT

    const user = await User.findById(userPayload.id).select("-password");
    req.user = user; // Everytime user logs in, the user info will be stored as a property inside the 'req' object

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authorization Failed");
  }
};

module.exports = authenticationMiddleware;
