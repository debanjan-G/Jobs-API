const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");
const User = require("../models/User");
const { NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.id }); // Finding all jobs of a particular user
  res
    .status(StatusCodes.OK)
    .json({ success: true, jobCount: jobs.length, jobs });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.id;

  const newJob = new Job(req.body);
  await newJob.save();

  res.status(StatusCodes.OK).json({ success: true, job: newJob });
};

const getSingleJob = async (req, res) => {
  const jobID = req.params.id;
  const user = req.user;

  const job = await Job.findOne({ _id: jobID, createdBy: user.id });

  if (!job) {
    throw new NotFoundError("No such job found.");
  }
  res.status(StatusCodes.OK).json({ success: true, job, createdBy: user.name });
};

const updateJob = async (req, res) => {
  const {
    body: update,
    params: { id: jobId },
    user,
  } = req; // Getting the JobID, the user info of author of job and also the update from request body

  const updatedJob = await Job.findOneAndUpdate(
    {
      _id: jobId,
      createdBy: user.id,
    },
    update,
    { new: true, runValidators: true }
  );

  if (!updatedJob) {
    throw new NotFoundError("No such job found.");
  }
  res
    .status(StatusCodes.OK)
    .json({ success: true, updatedJob, createdBy: user.name });
};

const deleteJob = async (req, res) => {
  const {
    params: { id: jobID },
    user,
  } = req;

  const job = await Job.findOneAndDelete({ _id: jobID, createdBy: user.id });
  if (!job) {
    throw new NotFoundError("No such job found.");
  }

  res.status(StatusCodes.OK).json({ success: true, deletedJob: job });
};

module.exports = { getAllJobs, createJob, getSingleJob, updateJob, deleteJob };
