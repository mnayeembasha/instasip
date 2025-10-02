import express from "express";
import { zodValidate } from "../middleware/zodValidate";
import { productCreateZodSchema } from "../validate/zodSchema";
import { adminMiddleware } from "../middleware/adminMiddleware";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProductsForAdmin,
    changeProductStatus,
    getProductBySlug
} from "../controllers/product.controller";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/id/:id", getProductById);
router.get("/slug/:slug", getProductBySlug);

// Admin routes
router.get("/admin/all", adminMiddleware, getAllProductsForAdmin);
router.post("/", zodValidate(productCreateZodSchema), adminMiddleware, createProduct);
router.put("/:id", zodValidate(productCreateZodSchema), adminMiddleware, updateProduct);
router.delete("/:id", adminMiddleware, deleteProduct);
router.put("/:id/status", adminMiddleware, changeProductStatus);

export default router;