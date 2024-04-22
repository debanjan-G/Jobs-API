const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Kindly provide a name"],
    maxlength: 20,
    minlength: 2,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Kindly provide an email"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Kindly provide an VALID email",
    ], //Ensuring email is valid
    unique: true, //Ensures there's no duplicate email
  },
  password: {
    type: String,
    required: [true, "Kindly provide a password"],
    minlength: 3,
    trim: true,
  },
});

//Mongoose Middleware
UserSchema.pre("save", async function (next) {
  // Dont use arrow function here
  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
  //We can use the 'this' keyword to get the properties of current document
  next();
});

UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, name: this.name, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

UserSchema.methods.verifyPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

const User = new mongoose.model("user", UserSchema);

module.exports = User;
