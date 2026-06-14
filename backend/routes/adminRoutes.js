import express from "express";
import {
    getPlatformStats,
    getAllUsers,
    toggleUserBlock,
    deleteUser,
    getAllJobs,
    deleteJob,
    getAllProposals
} from "../controllers/adminController.js";
import userIdMiddleware from "../middleware/userIdMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(userIdMiddleware, adminMiddleware);

router.get("/stats", getPlatformStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/block", toggleUserBlock);
router.delete("/users/:id", deleteUser);
router.get("/jobs", getAllJobs);
router.delete("/jobs/:id", deleteJob);
router.get("/proposals", getAllProposals);

export default router;
