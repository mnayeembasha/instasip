import { type Request, type Response } from "express";
import { Order, type OrderDocument } from "../models/Order";
import { Product } from "../models/Product";
import mongoose from "mongoose";
import { validateObjectId } from "../utils/validateObjectId";

const ID_ERROR_MESSAGE = 'Invalid Order ID';


const validateAndPrepareItem = async (item: any, session: mongoose.ClientSession) => {
    if (!mongoose.Types.ObjectId.isValid(item.product)) {
        throw new Error(`Invalid product ID: ${item.product}`);
    }

    const product = await Product.findById(item.product).session(session);
    if (!product) throw new Error(`Product not found: ${item.product}`);
    if (!product.isActive) throw new Error(`Product is not available: ${product.name}`);
    if (product.stock < item.quantity) {
        throw new Error(
            `Insufficient stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        );
    }

    await Product.updateOne(
        { _id: product._id },
        { $inc: { stock: -item.quantity } },
        { session }
    );

    return {
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        total: product.price * item.quantity
    };
};

export const createOrder = async (req: Request, res: Response) => {
    const { items, shippingAddress } = req.body;
    const userId = req.user?._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let totalAmount = 0;
        const orderItems = [];

        // Process each item
        for (const item of items) {
            const preparedItem = await validateAndPrepareItem(item, session);
            totalAmount += preparedItem.total;
            orderItems.push(preparedItem);
        }

        // Create order
        const orderData = { user: userId, items: orderItems, totalAmount, shippingAddress };
        const [createdOrder] = await Order.create([orderData], { session });

        if (!createdOrder) throw new Error("Failed to create order");

        await session.commitTransaction();
        session.endSession();

        // Populate order for response
        const populatedOrder = await Order.findById(createdOrder._id)
            .populate("user", "-password")
            .populate("items.product");

        return res.status(201).json({ message: "Order created successfully", order: populatedOrder });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error in createOrder controller:", error.message);
        res.status(400).json({ message: error.message || "Internal Server Error" });
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
                .populate('user','-password')
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
            .populate('user', '-password')
            .populate('items.product');

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }else{
            return res.status(200).json({
                message: "Order fetched successfully",
                order
            });
        }

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

        for (const item of order.items) {
            await Product.updateOne(
                { _id: item.product },
                { $inc: { stock: item.quantity } },
                { session }
            );
        }
        await Order.updateOne(
            { _id: orderId },
            { $set: { status: 'cancelled' } },
            { session }
        );

        await session.commitTransaction();

        return res.status(200).json({
            message: "Order cancelled successfully"
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

        // Build filter
        const filter: any = {};
        if (status && status !== 'all') filter.status = status;
        if (userId) filter.user = userId;

        // Fetch all orders matching filter and populate
        const orders = await Order.find(filter)
            .populate('user', '-password')
            .populate('items.product')
            .sort({ createdAt: -1 }); // latest first

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
        const updateData: any = { status };

        // Set delivered date if status is delivered
        if (status === 'delivered') {
            updateData.deliveredAt = new Date();
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        ).populate('user', '-password').populate('items.product');

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
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
