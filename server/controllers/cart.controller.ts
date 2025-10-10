import { type Request, type Response } from "express";
import { Cart, type CartItemDocument } from "../models/Cart";
import { Product } from "../models/Product";
import { validateObjectId } from "../utils/validateObjectId";

const ID_ERROR_MESSAGE = 'Invalid Product ID';

// Get user's cart
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

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { productId, quantity } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!validateObjectId(productId as string, ID_ERROR_MESSAGE, res)) return;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    // Check if product exists and is active
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found or inactive" });
    }

    // Check stock
    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} items available in stock`
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = (cart.items[existingItemIndex] as CartItemDocument).quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: `Cannot add more. Only ${product.stock} items available in stock`
        });
      }

      (cart.items[existingItemIndex] as CartItemDocument).quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // Populate and return
    cart = await cart.populate({
      path: "items.product",
      select: "name price image stock category slug isActive",
    });

    return res.status(200).json({
      message: "Item added to cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Error in addToCart controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update item quantity
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!validateObjectId(productId as string, ID_ERROR_MESSAGE, res)) return;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Check stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} items available in stock`
      });
    }

    (cart.items[itemIndex] as CartItemDocument).quantity = quantity;
    await cart.save();

    // Populate and return
    const updatedCart = await cart.populate({
      path: "items.product",
      select: "name price image stock category slug isActive",
    });

    return res.status(200).json({
      message: "Cart updated successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error in updateCartItem controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.params;

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

// Clear cart
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
