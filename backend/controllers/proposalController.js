import proposalModel from "../models/Proposal.js";
import jobModel from "../models/Job.js";
import Conversation from "../models/Conversation.js";

// Apply for a Job (Submit Proposal)
export const applyToJob = async (req, res) => {
    try {
        const { jobId, coverLetter, bidAmount, deliveryTime } = req.body;
        const freelancerId = req.userId;

        if (!jobId || !coverLetter || !bidAmount || !deliveryTime) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const job = await jobModel.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        if (job.status !== 'open') {
            return res.status(400).json({ success: false, message: "This job is no longer accepting proposals" });
        }

        let resumePath = null;
        if (req.file) {
            resumePath = `/uploads/resumes/${req.file.filename}`;
        }

        const newProposal = new proposalModel({
            jobId,
            freelancerId,
            coverLetter,
            bidAmount,
            deliveryTime,
            resume: resumePath,
            isSeenByClient: false, // New for the client
            isSeenByFreelancer: true // Current user created it, so they've seen it
        });

        await newProposal.save();
        res.status(201).json({ success: true, message: "Proposal submitted successfully", proposal: newProposal });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "You have already submitted a proposal for this job" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Proposals for a specific Job (Client View)
export const getJobProposals = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await jobModel.findById(jobId);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Verify ownership
        if (job.clientId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to view proposals for this job" });
        }

        const proposals = await proposalModel.find({ jobId })
            .populate("freelancerId", "fullName email profileImage skills isAvailable bio title experienceLevel rating totalReviews")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, proposals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Proposal Status (Client Action)
export const updateProposalStatus = async (req, res) => {
    try {
        const { id } = req.params; // Changed to :id as per requirement
        const { status } = req.body;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const proposal = await proposalModel.findById(id).populate("jobId");
        if (!proposal) {
            return res.status(404).json({ success: false, message: "Proposal not found" });
        }

        // Verify job ownership
        if (proposal.jobId.clientId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to update this proposal" });
        }

        proposal.status = status;
        proposal.isSeenByFreelancer = false; // Important: Notify freelancer
        await proposal.save();

        // If accepted, update job status to in-progress
        if (status === 'accepted') {
            await jobModel.findByIdAndUpdate(proposal.jobId._id, { status: 'in-progress' });
            
            // Auto-create Chat Conversation
            const existingConversation = await Conversation.findOne({
                jobId: proposal.jobId._id,
                participants: { $all: [proposal.jobId.clientId, proposal.freelancerId] }
            });

            if (!existingConversation) {
                const newConversation = new Conversation({
                    jobId: proposal.jobId._id,
                    participants: [proposal.jobId.clientId, proposal.freelancerId]
                });
                await newConversation.save();
            }
        }

        res.status(200).json({ success: true, message: `Proposal ${status} successfully`, proposal });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Freelancer's Proposals (My Applications)
export const getMyProposals = async (req, res) => {
    try {
        const proposals = await proposalModel.find({ freelancerId: req.userId })
            .populate({
                path: 'jobId',
                select: 'jobTitle budget deadline status category',
                populate: { path: 'clientId', select: 'fullName companyName' }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, proposals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Unseen Proposals Count (For Sidebar Notification)
export const getUnseenCount = async (req, res) => {
    try {
        const userId = req.userId;
        
        // Try to find if user is freelancer or client to determine which field to check
        // Check freelancer first
        const isFreelancer = await proposalModel.exists({ freelancerId: userId });
        
        let count = 0;
        if (isFreelancer) {
            count = await proposalModel.countDocuments({ freelancerId: userId, isSeenByFreelancer: false });
        } else {
            // Check if client (proposals for their jobs)
            const myJobs = await jobModel.find({ clientId: userId }).select("_id");
            const jobIds = myJobs.map(job => job._id);
            count = await proposalModel.countDocuments({ jobId: { $in: jobIds }, isSeenByClient: false });
        }

        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark all relevant proposals as seen
export const markAsSeen = async (req, res) => {
    try {
        const userId = req.userId;

        // Mark for Freelancer
        await proposalModel.updateMany(
            { freelancerId: userId, isSeenByFreelancer: false },
            { isSeenByFreelancer: true }
        );

        // Mark for Client (All proposals for their jobs)
        const myJobs = await jobModel.find({ clientId: userId }).select("_id");
        const jobIds = myJobs.map(job => job._id);
        await proposalModel.updateMany(
            { jobId: { $in: jobIds }, isSeenByClient: false },
            { isSeenByClient: true }
        );

        res.status(200).json({ success: true, message: "Notifications marked as seen" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
