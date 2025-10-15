import { type Request, type Response } from "express";
import { Cart, type CartItemDocument } from "../models/Cart";
import { Product } from "../models/Product";
import { validateObjectId } from "../utils/validateObjectId";

const ID_ERROR_MESSAGE = 'Invalid Product ID';

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price image stock category slug isActive",
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
      cart = await cart.populate({
        path: "items.product",
        select: "name price image stock category slug isActive",
      });
    }

    // Filter out inactive products or products that no longer exist
    const validItems = cart.items.filter(
      (item: any) => item.product && item.product.isActive
    );

    // Update cart if items were filtered
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    return res.status(200).json({
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error) {
    console.error("Error in getCart controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

import mongoose from "mongoose";

export const addToCart = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user?._id;
    const { productId, quantity } = req.body;

    if (!userId) {
      await session.abortTransaction();
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!validateObjectId(productId as string, ID_ERROR_MESSAGE, res)) {
      await session.abortTransaction();
      return;
    }

    if (!quantity || quantity < 1) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid quantity" });
    }

    // 🔒 Lock product document for this transaction
    const product = await Product.findOne({ _id: productId, isActive: true })
      .session(session)
      .exec();

    if (!product) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Product not found or inactive" });
    }

    // Check stock again inside transaction
    if (quantity > product.stock) {
      await session.abortTransaction();
      return res.status(400).json({
        message: `Only ${product.stock} items available in stock`,
      });
    }

    // Find or create cart (transaction-safe)
    let cart = await Cart.findOne({ user: userId }).session(session);
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity =
        (cart.items[existingItemIndex] as CartItemDocument).quantity + quantity;

      if (newQuantity > product.stock) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Cannot add more. Only ${product.stock} items available in stock`,
        });
      }

      (cart.items[existingItemIndex] as CartItemDocument).quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save({ session });

    // reduce product stock immediately (optional business logic)
    // product.stock -= quantity;
    // await product.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Populate outside transaction for cleaner response
    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.product",
        select: "name price image stock category slug isActive",
      })
      .lean();

    return res.status(200).json({
      message: "Item added to cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Error in addToCart controller", error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user?._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!userId) {
      await session.abortTransaction();
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!validateObjectId(productId as string, ID_ERROR_MESSAGE, res)) {
      await session.abortTransaction();
      return;
    }

    if (!quantity || quantity < 1) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid quantity" });
    }

    // Find cart and lock for transaction
    const cart = await Cart.findOne({ user: userId }).session(session);
    if (!cart) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Lock product for this transaction
    const product = await Product.findOne({ _id: productId, isActive: true })
      .session(session)
      .exec();

    if (!product) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Product not found or inactive" });
    }

    // Validate stock again inside transaction
    if (quantity > product.stock) {
      await session.abortTransaction();
      return res.status(400).json({
        message: `Only ${product.stock} items available in stock`,
      });
    }

    // Update quantity
    (cart.items[itemIndex] as CartItemDocument).quantity = quantity;

    await cart.save({ session });

    // (Optional) If you reserve stock for cart items, you could also:
    // product.stock -= quantity; 
    // await product.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Populate outside transaction for cleaner response
    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.product",
        select: "name price image stock category slug isActive",
      })
      .lean();

    return res.status(200).json({
      message: "Cart updated successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error in updateCartItem controller", error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const productId  = req.params.productId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!validateObjectId(productId as string, ID_ERROR_MESSAGE, res)) return;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item: any) => item.product.toString() !== productId
    );

    await cart.save();

    // Populate and return
    const updatedCart = await cart.populate({
      path: "items.product",
      select: "name price image stock category slug isActive",
    });

    return res.status(200).json({
      message: "Item removed from cart successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error in removeFromCart controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("Error in clearCart controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
