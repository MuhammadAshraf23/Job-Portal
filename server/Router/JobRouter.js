const express = require("express");
const JobRouter = express.Router();

// Controllers
const JobController = require("../Controller/JobController");

// Job routes
JobRouter.get("/", JobController.getAllJobs);
JobRouter.post("/", JobController.addJob);
JobRouter.delete("/", JobController.deleteAllJobs);

JobRouter.get("/my-jobs", JobController.getMyJobs);
JobRouter.get("/:id", JobController.getSingleJob);
JobRouter.patch("/:id", JobController.updateSingleJob);
JobRouter.delete("/:id", JobController.deleteSingleJob);

module.exports = JobRouter;