const express = require("express");
const ApplicationRouter = express.Router();

// Controllers
const ApplicationController = require("../Controller/ApplicationController");

// Application routes
ApplicationRouter.get("/applicant-jobs", ApplicationController.getCandidateAppliedJobs);
ApplicationRouter.post("/apply", ApplicationController.applyInJob);
ApplicationRouter.get("/recruiter-jobs", ApplicationController.getRecruiterPostJobs);
ApplicationRouter.patch("/:id", ApplicationController.updateJobStatus);

module.exports = ApplicationRouter;