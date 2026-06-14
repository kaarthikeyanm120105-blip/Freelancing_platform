import mongoose from "mongoose";

const workSubmissionSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        proposalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Proposal",
            required: true,
        },
        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Freelancer",
            required: true,
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },
        files: [
            {
                fileName: { type: String, required: true },
                fileUrl: { type: String, required: true },
                fileType: { type: String },
                fileSize: { type: Number },
            },
        ],
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "revision_requested"],
            default: "pending",
        },
        clientFeedback: {
            type: String,
        },
    },
    { timestamps: true }
);

const workSubmissionModel = mongoose.models.WorkSubmission || mongoose.model("WorkSubmission", workSubmissionSchema);
export default workSubmissionModel;
