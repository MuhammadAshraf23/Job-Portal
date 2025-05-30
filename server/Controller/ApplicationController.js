const ApplicationModel = require("../Model/ApplicationModel");
const mongoose = require("mongoose");
const createError = require("http-errors");

const day = require("dayjs");

exports.testing = async (req, res, next) => {
    try {
        res.status(200).json({
            status: "Ok",
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

module.exports.getCandidateAppliedJobs = async (req, res, next) => {
    try {
        const { applicantId } = req.query; // Get applicantId from query parameters

        // Validate applicantId
        if (!applicantId || !mongoose.Types.ObjectId.isValid(applicantId)) {
            return next(createError(400, "Valid applicantId is required"));
        }

        const filters = { ...req.query, applicantId }; // to make a copy so that original doesn't get modified
        // exclude
        const excludeFields = ["sort", "page", "limit", "fields", "search"];
        excludeFields.forEach((field) => delete filters[field]);

        const queries = {};

        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            queries.sortBy = sortBy;
        }

        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            queries.fields = fields;
        }
        if (req.query.limit) {
            const limit = req.query.limit.split(",").join(" ");
            queries.limit = limit;
        }

        if (req.query.page) {
            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 5);
            const skip = (page - 1) * limit;

            queries.skip = skip;
            queries.limit = limit;
            queries.page = page;
        }

        const { result, totalJobs, pageCount, page } = await getData(
            filters,
            queries
        );

        // response
        if (result.length !== 0) {
            res.status(200).json({
                status: true,
                result,
                totalJobs,
                currentPage: page,
                pageCount: pageCount || 1,
            });
        } else {
            next(createError(500, "Job List is empty"));
        }
    } catch (error) {
        next(createError(500, `Something went wrong: ${error.message}`));
    }
};

const getData = async (filters, queries) => {
    let sortCriteria = {};

    if (queries.sortBy) {
        switch (queries.sortBy) {
            case "newest":
                sortCriteria = { createdAt: -1 };
                break;
            case "oldest":
                sortCriteria = { createdAt: 1 };
                break;
            case "a-z":
                sortCriteria = { position: 1 };
                break;
            case "z-a":
                sortCriteria = { position: -1 };
                break;
            default:
                // Default sorting criteria if none of the options match
                sortCriteria = { createdAt: -1 };
                break;
        }
    } else {
        // Default sorting criteria if sortBy parameter is not provided
        sortCriteria = { createdAt: -1 };
    }
    const result = await ApplicationModel.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .sort(sortCriteria)
        .select(queries.fields)
        .populate("jobId");

    // it does not depend on the previous one, its document number will be based on filter passed here
    const totalJobs = await ApplicationModel.countDocuments(filters);
    const pageCount = Math.ceil(totalJobs / queries.limit);
    return { result, totalJobs, pageCount, page: queries.page };
};

module.exports.getRecruiterPostJobs = async (req, res, next) => {
    try {
        // Get recruiterId from query parameters
        const { recruiterId } = req.query;
        if (!recruiterId || !mongoose.Types.ObjectId.isValid(recruiterId)) {
            return next(createError(400, "Valid Recruiter ID is required"));
        }

        const filter = { recruiterId: recruiterId };
        
        const result = await ApplicationModel.find(filter)
            .populate("jobId")
            .sort({ createdAt: -1 });

        const totalJobs = await ApplicationModel.countDocuments(filter);

        if (result.length !== 0) {
            res.status(200).json({
                status: true,
                totalJobs,
                result,
            });
        } else {
            next(createError(404, "No Job Found"));
        }
    } catch (error) {
        next(createError(500, `Something went wrong: ${error.message}`));
    }
};

exports.applyInJob = async (req, res, next) => {
    try {
        const { applicantId, recruiterId, jobId, resume } = req.body;
        
        // Validate required fields
        if (!applicantId || !mongoose.Types.ObjectId.isValid(applicantId)) {
            return next(createError(400, "Valid applicant ID is required"));
        }
        
        if (!recruiterId || !mongoose.Types.ObjectId.isValid(recruiterId)) {
            return next(createError(400, "Valid recruiter ID is required"));
        }
        
        if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
            return next(createError(400, "Valid job ID is required"));
        }
        
        // Check if already applied
        const alreadyApplied = await ApplicationModel.findOne({
            applicantId,
            jobId,
        });

        if (alreadyApplied) {
            return next(createError(400, "You have already applied for this job"));
        }
        
        // Create application
        const applicationData = {
            applicantId,
            recruiterId,
            jobId,
            status: "pending",
            dateOfApplication: new Date(),
            resume: resume || ""
        };
        
        const applied = new ApplicationModel(applicationData);
        const result = await applied.save();
        
        res.status(201).json({
            status: true,
            message: "Applied Successfully",
            result,
        });
    } catch (error) {
        console.error("Application error:", error);
        next(createError(500, `Something went wrong: ${error.message}`));
    }
};

module.exports.updateJobStatus = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    try {
        // Get recruiterId from request body instead of req.user
        const { recruiterId } = data;

        if (!recruiterId || !mongoose.Types.ObjectId.isValid(recruiterId)) {
            return next(createError(400, "Valid Recruiter ID is required"));
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            next(createError(400, "Invalid Job ID format"));
        }

        const isJobExists = await ApplicationModel.findOne({ _id: id });
        if (!isJobExists) {
            next(createError(500, "Job not found"));
        }

        // Check if the recruiterId matches the one in the application
        if (isJobExists.recruiterId.toString() !== recruiterId.toString()) {
            next(createError(403, "Unauthorized user to update job"));
        } else {
            const updatedJob = await ApplicationModel.findByIdAndUpdate(
                id,
                { $set: data },
                {
                    new: true,
                }
            );
            res.status(200).json({
                status: true,
                message: "Job Updated",
                result: updatedJob,
            });
        }
    } catch (error) {
        next(createError(500, `Something went wrong: ${error.message}`));
    }
};