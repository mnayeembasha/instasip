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

const router = express.Router();

// User routes
router.post("/create-order", authMiddleware, createRazorpayOrder);
router.post("/verify", authMiddleware, verifyPayment);

// Admin routes
router.get("/admin/all", adminMiddleware, getAllPayments);
router.get("/admin/stats", adminMiddleware, getPaymentStats);
router.get("/admin/:id", adminMiddleware, getPaymentById);

export default router;