import { type Request, type Response } from "express";
import { Order, type OrderDocument } from "../models/Order";
import { Product } from "../models/Product";
import { Payment } from "../models/Payment";
import { type UserDocument } from "../models/User";
import mongoose from "mongoose";
import { validateObjectId } from "../utils/validateObjectId";
import { Cart } from "../models/Cart";
import crypto from "crypto";
import { RAZORPAY_KEY_SECRET } from "../config";
import { razorpay } from "./payment.controller";
import { sendOrderConfirmationEmail, sendOrderDeliveredEmail } from "../services/emailService";
import type { PopulatedOrderDocument } from "../templates/emailTemplates";

const ID_ERROR_MESSAGE = 'Invalid Order ID';

// Helper function to remove sensitive fields from order
const sanitizeOrder = (order: any) => {
  if (!order) return null;
  
  const orderObj = order.toObject ? order.toObject() : order;
  delete orderObj.razorpaySignature;
  return orderObj;
};

// Helper function to sanitize multiple orders
const sanitizeOrders = (orders: any[]) => {
  return orders.map(order => sanitizeOrder(order));
};

export const validateAndPrepareItem = async (
  item: { product: string; quantity: number },
  session: mongoose.ClientSession
) => {
  if (!mongoose.Types.ObjectId.isValid(item.product)) {
    throw new Error(`Invalid product ID: ${item.product}`);
  }

  const updateResult = await Product.updateOne(
    { _id: item.product, stock: { $gte: item.quantity }, isActive: true },
    { $inc: { stock: -item.quantity } },
    { session }
  );

  if (updateResult.modifiedCount === 0) {
    const freshProduct = await Product.findById(item.product).session(session);
    if (!freshProduct) throw new Error(`Product no longer exists: ${item.product}`);
    if (!freshProduct.isActive) throw new Error(`Product is not available: ${freshProduct.name}`);
    throw new Error(
      `Insufficient stock for product: ${freshProduct.name}. ` +
      `Available: ${freshProduct.stock}, Requested: ${item.quantity}`
    );
  }

  const product = await Product.findById(item.product).session(session);
  if (!product) throw new Error(`Product not found after stock update: ${item.product}`);

  return {
    product: product._id,
    quantity: item.quantity,
    price: product.price,
    total: product.price * item.quantity
  };
};

export const createOrder = async (req: Request, res: Response) => {
  const { items, shippingAddress, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  const userId = req.user?._id;

  // Check if payment already exists
  const existingPayment = await Payment.findOne({ 
    razorpayPaymentId 
  });
  
  if (existingPayment) {
    return res.status(400).json({ 
      message: "Payment already processed",
      orderId: existingPayment.order 
    });
  }

  // Verify payment signature
  try {
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(razorpaySignature, 'hex'))) {
      await Payment.create({ 
        user: userId, 
        razorpayOrderId, 
        razorpayPaymentId, 
        razorpaySignature, 
        amount: 0, 
        status: 'failed', 
        errorCode: 'SIGNATURE_MISMATCH' 
      });
      return res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    return res.status(400).json({ message: "Payment verification failed" });
  }

  // Validate order amount matches razorpay
  try {
    const razorpayOrder = await razorpay.orders.fetch(razorpayOrderId);
    
    // Calculate expected total from products
    let calculatedTotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }
      calculatedTotal += product.price * item.quantity;
    }
    
    const razorpayAmount: number = Number(razorpayOrder.amount) / 100; // Convert paise to rupees
    
    if (Math.abs(calculatedTotal - razorpayAmount) > 0.01) { // Allow 1 paisa difference for rounding
      throw new Error(
        `Amount mismatch. Calculated: ₹${calculatedTotal}, Paid: ₹${razorpayAmount}`
      );
    }
  } catch (error: any) {
    console.error("Order amount validation failed:", error);
    return res.status(400).json({ 
      message: "Order validation failed. Please contact support.",
      error: error.message 
    });
  }

  // Start MongoDB transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let totalAmount = 0;
    const orderItems = [];

    // Process each item with transaction-safe stock deduction
    for (const item of items) {
      const preparedItem = await validateAndPrepareItem(item, session);
      totalAmount += preparedItem.total;
      orderItems.push(preparedItem);
    }

    // Create order
    const [createdOrder] = await Order.create([{
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: 'confirmed',
      paymentStatus: 'paid',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    }], { session });

    if (!createdOrder) throw new Error("Failed to create order");

    // Save payment record
    await Payment.create([{
      user: userId,
      order: createdOrder._id,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      amount: totalAmount,
      currency: 'INR',
      status: 'captured',
      contact: req.user?.phone
    }], { session });

    // Clear user's cart
    await Cart.findOneAndUpdate({ user: userId }, { items: [] }, { session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Populate order for response
    const populatedOrder = await Order.findById(createdOrder._id)
      .populate("user", "-password")
      .populate("items.product") as PopulatedOrderDocument | null;

    // Send order confirmation email (non-blocking)
    // if (req.user?.email && populatedOrder) {
    //   sendOrderConfirmationEmail(
    //     req.user.email,
    //     req.user.name,
    //     populatedOrder
    //   ).catch(err => console.error('Failed to send order confirmation email:', err));
    // }

    if (req.user?.email && populatedOrder) {
      await sendOrderConfirmationEmail(
        req.user.email,
        req.user.name,
        populatedOrder
      );
    }

    // Remove sensitive data before sending response
    const sanitizedOrder = sanitizeOrder(populatedOrder);

    return res.status(201).json({ 
      message: "Order placed successfully", 
      order: sanitizedOrder 
    });
  } catch (error: unknown) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in createOrder:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    res.status(400).json({ message });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { page = '1', limit = '10' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.max(1, parseInt(limit as string) || 10);
    const skip = (pageNum - 1) * limitNum;

    const [orders, totalOrders] = await Promise.all([
      Order.find({ user: userId })
        .select('-razorpaySignature')
        .populate('user', '-password')
        .populate('items.product')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments({ user: userId })
    ]);

    const totalPages = Math.ceil(totalOrders / limitNum);

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalOrders,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      }
    });
  } catch (error) {
    console.error("Error in getMyOrders controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const userId = req.user?._id;

  if (!validateObjectId(orderId as string, ID_ERROR_MESSAGE, res)) return;

  try {
    const order = await Order.findOne({ _id: orderId, user: userId })
      .select('-razorpaySignature')
      .populate('user', '-password')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
      order
    });
  } catch (error) {
    console.error("Error in getOrderById controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const userId = req.user?._id;

  if (!validateObjectId(orderId as string, ID_ERROR_MESSAGE, res)) return;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findOne({ _id: orderId, user: userId }).session(session);

    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== 'pending' && order.status !== 'confirmed') {
      await session.abortTransaction();
      return res.status(400).json({
        message: `Cannot cancel order. Current status: ${order.status}`
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    // Update order status
    await Order.updateOne(
      { _id: orderId },
      { $set: { status: 'cancelled', paymentStatus: 'refunded' } },
      { session }
    );

    // Update payment record
    await Payment.updateOne(
      { order: orderId },
      {
        $set: {
          status: 'refunded',
          refundAmount: order.totalAmount,
          refundedAt: new Date()
        }
      },
      { session }
    );

    await session.commitTransaction();

    return res.status(200).json({
      message: "Order cancelled successfully. Refund will be processed within 5-7 business days."
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error in cancelOrder controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    session.endSession();
  }
};

// Admin Controllers
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { status, userId } = req.query;

    const filter: Record<string, string> = {};
    if (status && status !== 'all') filter.status = status as string;
    if (userId) filter.user = userId as string;

    const orders = await Order.find(filter)
      .select('-razorpaySignature')
      .populate('user', '-password')
      .populate('items.product')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders
    });
  } catch (error) {
    console.error("Error in getAllOrders controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const { status } = req.body;

  if (!validateObjectId(orderId as string, ID_ERROR_MESSAGE, res)) return;

  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const updateData: Record<string, string | Date> = { status };

    if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    )
      .select('-razorpaySignature')
      .populate('user', '-password')
      .populate('items.product') as PopulatedOrderDocument | null;

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Send delivered email when status is changed to 'delivered'
    // if (status === 'delivered' && updatedOrder.user) {
    //   const user = updatedOrder.user as UserDocument;
    //   if (user.email) {
    //     // Fetch the complete order with signature for email
    //     const completeOrder = await Order.findById(orderId)
    //       .populate('user', '-password')
    //       .populate('items.product') as PopulatedOrderDocument | null;
        
    //     if (completeOrder) {
    //       sendOrderDeliveredEmail(
    //         user.email,
    //         user.name,
    //         completeOrder
    //       ).catch(err => console.error('Failed to send order delivered email:', err));
    //     }
    //   }
    // }

    if (status === 'delivered' && updatedOrder.user) {
      const user = updatedOrder.user as UserDocument;
      if (user.email && updatedOrder) {
        await sendOrderDeliveredEmail(user.email, user.name, updatedOrder);
      }
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.error("Error in updateOrderStatus controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};