import stripe from "../config/stripe.js";
import paymentModel from "../models/Payment.js";
import jobModel from "../models/Job.js";
import proposalModel from "../models/Proposal.js";
import withdrawalModel from "../models/Withdrawal.js";
import mongoose from "mongoose";

// 1. Create Payment Intent (Stripe)
export const createPaymentIntent = async (req, res) => {
    try {
        const { amount, jobId } = req.body;

        if (!amount || !jobId) {
            return res.status(400).json({ success: false, message: "Amount and Job ID are required" });
        }

        const job = await jobModel.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        if (job.clientId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Unauthorized: Only the client can initiate payment" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // in paise
            currency: "inr",
            metadata: { jobId: jobId.toString() },
        });

        res.status(201).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error("Create Payment Intent Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Confirm Payment (save to DB after successful stripe charge)
export const confirmPayment = async (req, res) => {
    try {
        const { jobId, amount, stripePaymentIntentId } = req.body;

        if (!jobId || !amount || !stripePaymentIntentId) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Find the accepted proposal to get the freelancerId
        const proposal = await proposalModel.findOne({ jobId, status: "accepted" });
        if (!proposal) {
            return res.status(404).json({ success: false, message: "No accepted proposal found for this job" });
        }

        // Check if payment already exists for this job
        const existingPayment = await paymentModel.findOne({ jobId });
        if (existingPayment) {
            return res.status(200).json({ success: true, message: "Payment already recorded" });
        }

        const payment = new paymentModel({
            jobId,
            clientId: req.userId,
            freelancerId: proposal.freelancerId,
            amount,
            stripePaymentIntentId,
            status: "paid",
        });

        await payment.save();

        // Freeze job to indicate escrow
        await jobModel.findByIdAndUpdate(jobId, { status: "frozen" });

        return res.status(201).json({ success: true, message: "Payment confirmed and saved successfully" });
    } catch (error) {
        console.error("Confirm Payment Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Release Payment (client releases payment to freelancer)
export const releasePayment = async (req, res) => {
    try {
        const { jobId } = req.params;

        const payment = await paymentModel.findOne({ jobId, status: "paid" });
        if (!payment) {
            return res.status(404).json({ success: false, message: "No paid escrow found for this job" });
        }

        if (payment.clientId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Unauthorized: Only the client can release payment" });
        }

        payment.status = "released";
        await payment.save();

        // Close job and mark proposal completed
        await jobModel.findByIdAndUpdate(jobId, { status: "closed" });
        await proposalModel.findOneAndUpdate({ jobId, status: "accepted" }, { status: "completed" });

        res.status(200).json({ success: true, message: "Payment released to freelancer successfully" });
    } catch (error) {
        console.error("Release Payment Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Get Freelancer Earnings
export const getFreelancerEarnings = async (req, res) => {
    try {
        const earnings = await paymentModel
            .find({ freelancerId: req.userId })
            .populate("jobId", "jobTitle")
            .populate("clientId", "fullName")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, earnings });
    } catch (error) {
        console.error("Get Earnings Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// 5. Get Client Payments
export const getClientPayments = async (req, res) => {
    try {
        const payments = await paymentModel
            .find({ clientId: req.userId })
            .populate("jobId", "jobTitle")
            .populate("freelancerId", "fullName")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, payments });
    } catch (error) {
        console.error("Get Client Payments Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// 6. Request Withdrawal (Fake/Virtual)
export const requestWithdrawal = async (req, res) => {
    try {
        const { amount } = req.body;
        const freelancerId = req.userId;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid withdrawal amount" });
        }

        // Calculate available balance
        // Total released payments
        const payments = await paymentModel.find({ freelancerId, status: "released" });
        const totalEarned = payments.reduce((acc, curr) => acc + curr.amount, 0);

        // Total completed withdrawals
        const withdrawals = await withdrawalModel.find({ freelancerId, status: "completed" });
        const totalWithdrawn = withdrawals.reduce((acc, curr) => acc + curr.amount, 0);

        const availableBalance = totalEarned - totalWithdrawn;

        if (amount > availableBalance) {
            return res.status(400).json({ success: false, message: "Insufficient balance" });
        }

        // Create withdrawal record
        const withdrawal = new withdrawalModel({
            freelancerId,
            amount,
            status: "completed", // Auto-complete for this virtual system
            note: "Virtual withdrawal processed successfully"
        });

        await withdrawal.save();

        res.status(201).json({
            success: true,
            message: "Withdrawal successful",
            withdrawal
        });
    } catch (error) {
        console.error("Withdrawal Request Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. Get Withdrawal History
export const getWithdrawalHistory = async (req, res) => {
    try {
        const withdrawals = await withdrawalModel
            .find({ freelancerId: req.userId })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, withdrawals });
    } catch (error) {
        console.error("Get Withdrawal History Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 8. Get Wallet Stats (Monthly Chart + Performance Metrics)
export const getWalletStats = async (req, res) => {
    try {
        const freelancerId = new mongoose.Types.ObjectId(req.userId);

        // --- Monthly earnings for last 6 months ---
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const monthlyEarnings = await paymentModel.aggregate([
            {
                $match: {
                    freelancerId,
                    status: { $in: ["paid", "released"] },
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    earned: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Build a full 6-month array (fill missing months with 0)
        const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyMap = {};
        monthlyEarnings.forEach(e => {
            const key = `${e._id.year}-${e._id.month}`;
            monthlyMap[key] = e.earned;
        });

        const chartData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const year = d.getFullYear();
            const month = d.getMonth() + 1; // 1-based
            const key = `${year}-${month}`;
            chartData.push({
                month: MONTH_NAMES[month - 1],
                earned: monthlyMap[key] || 0
            });
        }

        // --- Performance Metrics ---
        const allProposals = await proposalModel.find({ freelancerId });
        const totalProposals = allProposals.length;
        const acceptedProposals = allProposals.filter(p =>
            ["accepted", "completed"].includes(p.status)
        ).length;
        const completedProposals = allProposals.filter(p => p.status === "completed").length;

        const successRate = totalProposals > 0
            ? Math.round((acceptedProposals / totalProposals) * 100)
            : 0;

        const onTimeRate = acceptedProposals > 0
            ? Math.round((completedProposals / acceptedProposals) * 100)
            : 0;

        res.status(200).json({
            success: true,
            chartData,
            performance: {
                successRate,
                onTimeRate,
                totalProposals,
                acceptedProposals,
                completedProposals
            }
        });
    } catch (error) {
        console.error("Get Wallet Stats Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
