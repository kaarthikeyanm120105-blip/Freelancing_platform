import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },
        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Freelancer",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "inr",
        },
        status: {
            type: String,
            enum: ["pending", "paid", "released"],
            default: "pending",
        },
        stripePaymentIntentId: {
            type: String,
        },
    },
    { timestamps: true }
);

const paymentModel = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default paymentModel;
