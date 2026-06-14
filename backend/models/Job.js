import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        jobTitle: {
            type: String,
            required: true,
            trim: true,
        },
        jobDescription: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        skillsRequired: [
            {
                type: String,
            },
        ],
        budget: {
            type: Number,
            required: true,
        },
        deadline: {
            type: Date,
            required: true,
        },
        experienceLevel: {
            type: String,
            enum: ["beginner", "intermediate", "expert"],
            default: "beginner",
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },
        status: {
            type: String,
            enum: ["open", "closed", "frozen", "in-progress", "completed"],
            default: "open",
        },
    },
    { timestamps: true }
);

const jobModel = mongoose.models.Job || mongoose.model("Job", jobSchema);
export default jobModel;
