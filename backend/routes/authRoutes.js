import express from "express";
import { register, login, logout, verifyUser, verifyEmail, getUserData, freelancerSetupProfile, freelancerUpdateProfile, clientSetupProfile, clientUpdateProfile, searchUsers, getPublicProfile } from "../controllers/authControllers.js";
import userIdMiddleware from "../middleware/userIdMiddleware.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify", userIdMiddleware, verifyUser);
router.post("/verifyEmail", userIdMiddleware, verifyEmail);
router.get("/userData", userIdMiddleware, getUserData);
router.get("/search", userIdMiddleware, searchUsers);
router.get("/public-profile/:id", userIdMiddleware, getPublicProfile);
router.post("/freelancer-setup", userIdMiddleware, freelancerSetupProfile);
router.post("/client-setup", userIdMiddleware, clientSetupProfile);
router.post("/update-profile", userIdMiddleware, upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), freelancerUpdateProfile);
router.post("/update-client-profile", userIdMiddleware, upload.fields([{ name: 'companyLogo', maxCount: 1 }]), clientUpdateProfile);
export default router;