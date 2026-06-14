import express from "express";
import { submitWork, getMySubmissions, getJobSubmissions, updateSubmissionStatus } from "../controllers/submissionController.js";
import userIdMiddleware from "../middleware/userIdMiddleware.js";
import submissionUpload from "../middleware/submissionMulter.js";

const router = express.Router();

// All submission routes require authentication
router.use(userIdMiddleware);

const uploadMiddleware = (req, res, next) => {
    submissionUpload.array("workFiles", 5)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error("Multer Error:", err);
            return res.status(400).json({ success: false, message: "Upload limit exceeded or format error." });
        } else if (err) {
            console.error("Upload Error:", err);
            return res.status(400).json({ success: false, message: err.message || "File type not supported." });
        }
        next();
    });
};

// Freelancer: Submit work for a project (supports multi-file upload)
router.post("/submit", uploadMiddleware, submitWork);

// Freelancer: Get my submissions for a specific project
router.get("/my-submissions/:proposalId", getMySubmissions);

// Client: Get all submissions for a job they posted
router.get("/job-submissions/:jobId", getJobSubmissions);

// Client: Approve or Request Revision
router.put("/:id/status", updateSubmissionStatus);

export default router;
