import { type Request, type Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "../config";
import { Payment } from "../models/Payment";

export const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID!,
  key_secret: RAZORPAY_KEY_SECRET!,
});

export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const userId = req.user?._id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      message: "Razorpay order created successfully",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error in createRazorpayOrder controller", error);
    res.status(500).json({ message: "Failed to create payment order" });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpaySignature;

    if (isValid) {
      return res.status(200).json({
        message: "Payment verified successfully",
        verified: true,
      });
    } else {
      return res.status(400).json({
        message: "Payment verification failed",
        verified: false,
      });
    }
  } catch (error) {
    console.error("Error in verifyPayment controller", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const { status, userId, startDate, endDate } = req.query;

    const filter: Record<string, unknown> = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (userId) {
      filter.user = userId;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt = { ...filter.createdAt as Record<string, unknown>, $gte: new Date(startDate as string) };
      }
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        filter.createdAt = { ...filter.createdAt as Record<string, unknown>, $lte: end };
      }
    }

    const payments = await Payment.find(filter)
      .populate('user', 'name phone')
      .populate('order', 'status totalAmount')
      .sort({ createdAt: -1 })
      .select('-razorpaySignature');

    // Calculate statistics
    const stats = {
      totalPayments: payments.length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      capturedPayments: payments.filter(p => p.status === 'captured').length,
      capturedAmount: payments.filter(p => p.status === 'captured').reduce((sum, p) => sum + p.amount, 0),
      failedPayments: payments.filter(p => p.status === 'failed').length,
      refundedPayments: payments.filter(p => p.status === 'refunded').length,
      refundedAmount: payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + (p.refundAmount || 0), 0),
    };

    return res.status(200).json({
      message: "Payments fetched successfully",
      payments,
      stats
    });
  } catch (error) {
    console.error("Error in getAllPayments controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.id;

    const payment = await Payment.findById(paymentId)
      .populate('user', 'name phone email')
      .populate('order')
      .select('-razorpaySignature');

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    return res.status(200).json({
      message: "Payment fetched successfully",
      payment
    });
  } catch (error) {
    console.error("Error in getPaymentById controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPaymentStats = async (req: Request, res: Response) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const payments = await Payment.find({
      createdAt: { $gte: startDate }
    });

    const stats = {
      period: `Last ${days} days`,
      totalTransactions: payments.length,
      totalRevenue: payments.filter(p => p.status === 'captured').reduce((sum, p) => sum + p.amount, 0),
      successfulPayments: payments.filter(p => p.status === 'captured').length,
      failedPayments: payments.filter(p => p.status === 'failed').length,
      refundedPayments: payments.filter(p => p.status === 'refunded').length,
      refundedAmount: payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + (p.refundAmount || 0), 0),
      successRate: payments.length > 0
        ? ((payments.filter(p => p.status === 'captured').length / payments.length) * 100).toFixed(2)
        : 0
    };

    // Daily breakdown
    const dailyStats = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayPayments = payments.filter(p => {
        const paymentDate = new Date(p.createdAt);
        return paymentDate >= date && paymentDate < nextDate;
      });

      dailyStats.push({
        date: date.toISOString().split('T')[0],
        transactions: dayPayments.length,
        revenue: dayPayments.filter(p => p.status === 'captured').reduce((sum, p) => sum + p.amount, 0),
        successful: dayPayments.filter(p => p.status === 'captured').length,
        failed: dayPayments.filter(p => p.status === 'failed').length
      });
    }

    return res.status(200).json({
      message: "Payment statistics fetched successfully",
      stats,
      dailyStats
    });
  } catch (error) {
    console.error("Error in getPaymentStats controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
