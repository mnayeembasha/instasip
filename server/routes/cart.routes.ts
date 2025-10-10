import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller";

const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update/:productId", updateCartItem);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

export default router;
