const express = require("express");
const { register, login } = require("../controllers/auth");
const {
  getAllJobs,
  createJob,
  deleteJob,
  getSingleJob,
  updateJob,
} = require("../controllers/jobs");

const jobsRouter = express.Router();

jobsRouter.route("/").get(getAllJobs).post(createJob);
jobsRouter.route("/:id").get(getSingleJob).patch(updateJob).delete(deleteJob);

module.exports = jobsRouter;
