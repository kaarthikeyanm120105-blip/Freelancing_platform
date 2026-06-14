import express from "express";
import {
    createPaymentIntent,
    confirmPayment,
    releasePayment,
    getFreelancerEarnings,
    getClientPayments,
    requestWithdrawal,
    getWithdrawalHistory,
    getWalletStats,
} from "../controllers/paymentController.js";
import userIdMiddleware from "../middleware/userIdMiddleware.js";

const router = express.Router();

router.post("/create-payment-intent", userIdMiddleware, createPaymentIntent);
router.post("/confirm", userIdMiddleware, confirmPayment);
router.post("/release/:jobId", userIdMiddleware, releasePayment);
router.get("/earnings", userIdMiddleware, getFreelancerEarnings);
router.get("/history", userIdMiddleware, getClientPayments);
router.post("/withdraw", userIdMiddleware, requestWithdrawal);
router.get("/withdrawals", userIdMiddleware, getWithdrawalHistory);
router.get("/stats", userIdMiddleware, getWalletStats);

export default router;
