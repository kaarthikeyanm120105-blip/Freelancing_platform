import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Freelancer",
            required: true,
        },
        coverLetter: {
            type: String,
            required: true,
        },
        bidAmount: {
            type: Number,
            required: true,
        },
        deliveryTime: {
            type: Number, // in days
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "completed"],
            default: "pending",
        },
        resume: {
            type: String, // Path to specific resume uploaded for this proposal
        },
        isSeenByFreelancer: {
            type: Boolean,
            default: true, // Freelancer created it, so they've "seen" their own initial post
        },
        isSeenByClient: {
            type: Boolean,
            default: false, // New for the client
        },
    },
    { timestamps: true }
);

// Prevent multiple proposals for the same job by the same freelancer
proposalSchema.index({ jobId: 1, freelancerId: 1 }, { unique: true });

const proposalModel = mongoose.models.Proposal || mongoose.model("Proposal", proposalSchema);
export default proposalModel;
