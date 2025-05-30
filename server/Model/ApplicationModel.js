const mongoose = require("mongoose");
const { STATUS } = require("../Utils/ApplicationConstants");

const ApplicationSchema = new mongoose.Schema(
    {
        applicantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Applicant ID is required"],
        },
        recruiterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Recruiter ID is required"],
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: [true, "Job ID is required"],
        },
        dateOfApplication: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: STATUS,
            default: "pending",
        },
        resume: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const ApplicationModel = mongoose.model("application", ApplicationSchema);
module.exports = ApplicationModel;
