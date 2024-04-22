const mongoose = require("mongoose");


const jobsSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Kindly provide the name of the company"],
      trim: true,
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Kindly provide the position"],
      maxlength: 50,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobsSchema);

module.exports = Job;
