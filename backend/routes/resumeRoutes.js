import express from "express";
import { analyzeResume } from "../controllers/resumeController.js";
import upload from "../middleware/upload.js";
import userIdMiddleware from "../middleware/userIdMiddleware.js";

const router = express.Router();

// POS /api/resume/analyze
router.post("/analyze", userIdMiddleware, upload.single("resume"), analyzeResume);

export default router;
