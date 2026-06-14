import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
    {
        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            default: "Bank Transfer (Virtual)",
        },
        note: {
            type: String,
        }
    },
    { timestamps: true }
);

const withdrawalModel = mongoose.model("Withdrawal", withdrawalSchema);
export default withdrawalModel;
