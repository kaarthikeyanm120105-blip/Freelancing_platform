import express from "express";
import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getClientJobs,
    getMatchedJobs,
} from "../controllers/jobController.js";
import userIdMiddleware from "../middleware/userIdMiddleware.js";

const router = express.Router();

// Freelancer matched jobs (Must be before /:id)
router.get("/matched/recommendations", userIdMiddleware, getMatchedJobs);

// Public routes (Freelancers can see all open jobs)
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Protected routes (Clients)
router.post("/", userIdMiddleware, createJob);
router.get("/client/myjobs", userIdMiddleware, getClientJobs);
router.put("/:id", userIdMiddleware, updateJob);
router.delete("/:id", userIdMiddleware, deleteJob);

export default router;
