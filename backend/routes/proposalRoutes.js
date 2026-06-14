import express from "express";
import { applyToJob, getJobProposals, updateProposalStatus, getMyProposals, getUnseenCount, markAsSeen } from "../controllers/proposalController.js";
import upload from "../middleware/upload.js";
import userIdMiddleware from "../middleware/userIdMiddleware.js";

const proposalRouter = express.Router();

proposalRouter.post("/", userIdMiddleware, upload.single('resume'), applyToJob);
proposalRouter.get("/job/:jobId", userIdMiddleware, getJobProposals);
proposalRouter.put("/:id", userIdMiddleware, updateProposalStatus);
proposalRouter.get("/my-applications", userIdMiddleware, getMyProposals);
proposalRouter.get("/unseen-count", userIdMiddleware, getUnseenCount);
proposalRouter.put("/mark-seen", userIdMiddleware, markAsSeen);

export default proposalRouter;
