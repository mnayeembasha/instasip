import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import {
  createRazorpayOrder,
  verifyPayment,
  getAllPayments,
  getPaymentById,
  getPaymentStats
} from "../controllers/payment.controller";
import { handleRazorpayWebhook, testUserLookup, testWebhook } from "../controllers/razorpay-webhook.controller";
import { paymentRateLimiter } from "../middleware/rateLimiter";

const router = express.Router();

//webhook route
router.post("/webhook", handleRazorpayWebhook);

// User routes
router.post("/create-order", paymentRateLimiter,authMiddleware, createRazorpayOrder);
router.post("/verify", authMiddleware, verifyPayment);

// Admin routes
router.get("/admin/all", adminMiddleware, getAllPayments);
router.get("/admin/stats", adminMiddleware, getPaymentStats);
router.get("/admin/:id", adminMiddleware, getPaymentById);

// Test routes
router.post("/admin/test-webhook", adminMiddleware, testWebhook);
router.post("/admin/test-user-lookup", adminMiddleware, testUserLookup);
export default router;