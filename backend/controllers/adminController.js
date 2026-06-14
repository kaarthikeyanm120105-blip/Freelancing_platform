import freelancerModel from "../models/freelancerSchema.js";
import clientModel from "../models/clientSchema.js";
import jobModel from "../models/Job.js";
import paymentModel from "../models/Payment.js";
import withdrawalModel from "../models/Withdrawal.js";
import proposalModel from "../models/Proposal.js";

// 1. Get Platform Statistics
export const getPlatformStats = async (req, res) => {
    try {
        const totalFreelancers = await freelancerModel.countDocuments({ role: 'freelancer' });
        const totalClients = await clientModel.countDocuments({ role: 'client' });
        const totalAdmins = await freelancerModel.countDocuments({ role: 'admin' });
        const totalUsers = totalFreelancers + totalClients + totalAdmins;

        const totalJobs = await jobModel.countDocuments();
        const totalPaymentsCount = await paymentModel.countDocuments({ status: 'released' });
        const totalPaymentsAmount = await paymentModel.aggregate([
            { $match: { status: 'released' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const totalWithdrawalsCount = await withdrawalModel.countDocuments({ status: 'completed' });
        const totalWithdrawalsAmount = await withdrawalModel.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalClients,
                totalFreelancers,
                totalJobs,
                totalPayments: totalPaymentsAmount[0]?.total || 0,
                totalWithdrawals: totalWithdrawalsAmount[0]?.total || 0,
                counts: {
                    payments: totalPaymentsCount,
                    withdrawals: totalWithdrawalsCount
                }
            }
        });
    } catch (error) {
        console.error("Get Stats Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get All Users
export const getAllUsers = async (req, res) => {
    try {
        const freelancers = await freelancerModel.find().select("-password");
        const clients = await clientModel.find().select("-password");

        const allUsers = [...freelancers, ...clients].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        res.status(200).json({ success: true, users: allUsers });
    } catch (error) {
        console.error("Get Users Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Toggle User Block Status
export const toggleUserBlock = async (req, res) => {
    try {
        const { id } = req.params;
        let user = await freelancerModel.findById(id) || await clientModel.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
            user
        });
    } catch (error) {
        console.error("Toggle Block Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Delete User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await freelancerModel.findByIdAndDelete(id) || await clientModel.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Get All Jobs
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await jobModel.find()
            .populate('clientId', 'fullName email companyName')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, jobs });
    } catch (error) {
        console.error("Get Jobs Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Delete Job (Moderation)
export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await jobModel.findByIdAndDelete(id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Also delete all proposals for this job
        await proposalModel.deleteMany({ jobId: id });

        res.status(200).json({ success: true, message: "Job and associated proposals deleted" });
    } catch (error) {
        console.error("Delete Job Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. Get All Proposals (Monitoring)
export const getAllProposals = async (req, res) => {
    try {
        const proposals = await proposalModel.find()
            .populate('freelancerId', 'fullName email')
            .populate('jobId', 'jobTitle')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, proposals });
    } catch (error) {
        console.error("Get Proposals Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
