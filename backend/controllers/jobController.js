import jobModel from "../models/Job.js";
import freelancerModel from "../models/freelancerSchema.js";
import mongoose from "mongoose";

// Create Job
export const createJob = async (req, res) => {
    try {
        const {
            jobTitle,
            jobDescription,
            category,
            skillsRequired,
            budget,
            deadline,
            experienceLevel,
        } = req.body;

        if (!jobTitle || !jobDescription || !category || !budget || !deadline) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const newJob = new jobModel({
            jobTitle,
            jobDescription,
            category,
            skillsRequired,
            budget,
            deadline,
            experienceLevel,
            clientId: req.userId,
        });

        await newJob.save();
        res.status(201).json({ success: true, message: "Job posted successfully", job: newJob });
    } catch (error) {
        console.error("Create Job Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Jobs (Available for Freelancers)
export const getAllJobs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const jobs = await jobModel.find({
            status: "open",
            deadline: { $gt: new Date() }
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("clientId", "fullName companyName profileImage companyLogo");

        const totalJobs = await jobModel.countDocuments({
            status: "open",
            deadline: { $gt: new Date() }
        });

        res.status(200).json({
            success: true,
            jobs,
            totalJobs,
            hasMore: totalJobs > skip + jobs.length
        });
    } catch (error) {
        console.error("Get All Jobs Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Job by ID
export const getJobById = async (req, res) => {
    try {
        const job = await jobModel.findById(req.params.id)
            .populate("clientId", "fullName companyName companyDescription industry profileImage companyLogo");

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        const applicantCount = await mongoose.model("Proposal").countDocuments({ jobId: req.params.id });

        res.status(200).json({ success: true, job: { ...job._doc, applicantCount } });
    } catch (error) {
        console.error("Get Job By ID Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Job
export const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await jobModel.findById(id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Verify ownership
        if (job.clientId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to update this job" });
        }

        const updatedJob = await jobModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, message: "Job updated successfully", job: updatedJob });
    } catch (error) {
        console.error("Update Job Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Job
export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await jobModel.findById(id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Verify ownership
        if (job.clientId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this job" });
        }

        await jobModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
        console.error("Delete Job Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Jobs Posted by Client
export const getClientJobs = async (req, res) => {
    try {
        const jobs = await jobModel.aggregate([
            { $match: { clientId: new mongoose.Types.ObjectId(req.userId) } },
            {
                $lookup: {
                    from: "proposals",
                    localField: "_id",
                    foreignField: "jobId",
                    as: "proposals"
                }
            },
            {
                $addFields: {
                    applicantCount: { $size: "$proposals" }
                }
            },
            { $project: { proposals: 0 } },
            { $sort: { createdAt: -1 } }
        ]);

        res.status(200).json({ success: true, jobs });
    } catch (error) {
        console.error("Get Client Jobs Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Matched Jobs for Freelancer
export const getMatchedJobs = async (req, res) => {
    try {
        const freelancerId = req.userId;
        const freelancer = await freelancerModel.findById(freelancerId);

        if (!freelancer || !freelancer.skills || freelancer.skills.length === 0) {
            return res.status(200).json({ success: true, jobs: [], message: "No skills found in profile. Add skills to see matches!" });
        }

        const freelancerSkills = freelancer.skills.map(s => s.toLowerCase());

        const allJobs = await jobModel.find({
            status: "open",
            deadline: { $gt: new Date() }
        }).populate("clientId", "fullName companyName profileImage companyLogo");

        const matchedJobs = allJobs.map(job => {
            if (!job.skillsRequired || job.skillsRequired.length === 0) return null;

            const jobSkills = job.skillsRequired.map(s => s.toLowerCase());
            const matchedSkills = job.skillsRequired.filter(s => 
                freelancerSkills.includes(s.toLowerCase())
            );

            const matchPercentage = Math.round((matchedSkills.length / job.skillsRequired.length) * 100);

            // Return matching metadata alongside job details
            return {
                ...job._doc,
                matchPercentage,
                matchedSkills: job.skillsRequired.filter(s => 
                    freelancerSkills.includes(s.toLowerCase())
                )
            };
        })
        .filter(job => job !== null && job.matchPercentage >= 30) // 30% threshold
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 10); // Top 10 matches

        res.status(200).json({ success: true, jobs: matchedJobs });
    } catch (error) {
        console.error("Get Matched Jobs Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
