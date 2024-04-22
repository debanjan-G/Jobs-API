const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose.connect(url); // returns a promise
};

module.exports = connectDB;
