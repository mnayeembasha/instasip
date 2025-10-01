import express from "express";
import { zodValidate } from "../middleware/zodValidate";
import { orderCreateZodSchema } from "../validate/zodSchema";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
} from "../controllers/order.controller";

const router = express.Router();

// User routes
router.post("/", zodValidate(orderCreateZodSchema), authMiddleware, createOrder);
router.get("/my", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id/cancel", authMiddleware, cancelOrder);

// Admin routes
router.get("/admin/all", adminMiddleware, getAllOrders);
router.put("/admin/:id/status", adminMiddleware, updateOrderStatus);

export default router;