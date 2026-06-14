import workSubmissionModel from "../models/WorkSubmission.js";
import proposalModel from "../models/Proposal.js";
import jobModel from "../models/Job.js";
import freelancerModel from "../models/freelancerSchema.js";

// Submit Work for an Active Project
export const submitWork = async (req, res) => {
    try {
        const { jobId, proposalId, message } = req.body;
        const freelancerId = req.userId;

        if (!jobId || !proposalId || !message) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Verify the proposal belongs to this freelancer and is 'accepted'
        const proposal = await proposalModel.findOne({
            _id: proposalId,
            freelancerId,
            status: "accepted",
        }).populate("jobId");

        if (!proposal) {
            return res.status(403).json({ success: false, message: "Unauthorized or invalid project status for submission" });
        }

        if (!proposal.jobId) {
            console.error("Job not found for this proposal:", proposalId);
            return res.status(404).json({ success: false, message: "Associated job not found" });
        }

        // Handle File Uploads
        let submissionFiles = [];
        if (req.files && req.files.length > 0) {
            submissionFiles = req.files.map((file) => ({
                fileName: file.originalname,
                fileUrl: `/uploads/submissions/${file.filename}`,
                fileType: file.mimetype,
                fileSize: file.size,
            }));
        }

        if (submissionFiles.length === 0) {
            return res.status(400).json({ success: false, message: "No files uploaded for submission" });
        }

        // Retrieve clientId safely - try various sources
        let finalClientId = proposal.jobId.clientId;
        
        if (!finalClientId) {
          const jobDoc = await jobModel.findById(jobId);
          if (jobDoc) finalClientId = jobDoc.clientId;
        }

        if (!finalClientId) {
            return res.status(400).json({ success: false, message: "Could not identify the client for this project" });
        }

        // Create Work Submission Record
        const newSubmission = new workSubmissionModel({
            jobId,
            proposalId,
            freelancerId,
            clientId: finalClientId,
            files: submissionFiles,
            message,
        });

        await newSubmission.save();

        res.status(201).json({
            success: true,
            message: "Work submitted successfully! Your client will be notified.",
            submission: newSubmission,
        });
    } catch (error) {
        console.error("SUBMISSION ERROR:", error);
        import('fs').then(fs => fs.writeFileSync('crash.log', 'SubmitWork Error: ' + error.stack));
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Submissions for a Project (Freelancer View)
export const getMySubmissions = async (req, res) => {
    try {
        const { proposalId } = req.params;
        const freelancerId = req.userId;

        const submissions = await workSubmissionModel.find({ proposalId, freelancerId })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, submissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Submissions for a Job (Client View)
export const getJobSubmissions = async (req, res) => {
    try {
        const { jobId } = req.params;
        const clientId = req.userId;

        // Verify ownership
        const job = await jobModel.findById(jobId);
        if (!job || job.clientId.toString() !== clientId) {
            return res.status(403).json({ success: false, message: "Unauthorized to view submissions for this job" });
        }

        const submissions = await workSubmissionModel.find({ jobId })
            .populate("freelancerId", "fullName email profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, submissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Approve or Request Revision for a Submission (Client View)
export const updateSubmissionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, clientFeedback } = req.body; // status: 'accepted' or 'revision_requested'
        const clientId = req.userId;

        const submission = await workSubmissionModel.findById(id);
        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        // Verify client ownership
        if (submission.clientId.toString() !== clientId) {
            return res.status(403).json({ success: false, message: "Unauthorized to update this submission" });
        }

        submission.status = status;
        if (clientFeedback) submission.clientFeedback = clientFeedback;
        await submission.save();

        // If accepted, complete the project
        if (status === "accepted") {
            // 1. Update Job Status
            await jobModel.findByIdAndUpdate(submission.jobId, { status: "completed" });

            // 2. Update Proposal Status
            await proposalModel.findByIdAndUpdate(submission.proposalId, { status: "completed" });

            // 3. Increment Freelancer Project Count
            await freelancerModel.findByIdAndUpdate(submission.freelancerId, {
                $inc: { completedProjects: 1 }
            });
        }

        res.status(200).json({
            success: true,
            message: status === "accepted" ? "Project completed successfully!" : "Revision requested.",
            submission
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
