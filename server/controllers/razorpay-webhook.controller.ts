import { type Request, type Response } from "express";
import crypto from "crypto";
import { RAZORPAY_WEBHOOK_SECRET } from "../config";
import { Payment } from "../models/Payment";
import { Order } from "../models/Order";
import { User } from "../models/User";


const verifyWebhookSignature = (payload: string, signature: string): boolean => {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET!)
      .update(payload)
      .digest("hex");

    return expectedSignature === signature;
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
};

const normalizePhone = (phone: string): string => {
  if (!phone) return "";

  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // Remove leading 91 if present (Indian country code)
  if (cleaned.startsWith("91") && cleaned.length > 10) {
    cleaned = cleaned.substring(2);
  }

  return cleaned;
};

const findUserByContact = async (contact: string) => {
  try {
    if (!contact) {
      console.log("⚠️ No contact provided for user lookup");
      return null;
    }

    const normalizedContact = normalizePhone(contact);
    console.log(`🔍 Looking up user with normalized phone: ${normalizedContact}`);

    // Find all users and check phone numbers
    const users = await User.find({});

    for (const user of users) {
      const normalizedUserPhone = normalizePhone(user.phone);
      if (normalizedUserPhone === normalizedContact) {
        console.log(`✅ User found: ${user._id} (${user.phone})`);
        return user;
      }
    }

    console.log(`❌ No user found with contact: ${contact}`);
    return null;
  } catch (error) {
    console.error("Error in findUserByContact:", error);
    return null;
  }
};

/**
 * Main webhook handler for Razorpay events
 * This endpoint receives POST requests from Razorpay servers
 */
export const handleRazorpayWebhook = async (req: Request, res: Response) => {
  try {
    // Get signature from headers
    const signature = req.headers["x-razorpay-signature"] as string;

    if (!signature) {
      console.error("❌ Webhook signature missing in headers");
      return res.status(400).json({ message: "Signature missing" });
    }

    // Get raw body for signature verification
    let rawBody: string;
    if (typeof req.body === 'string') {
      rawBody = req.body;
    } else if (Buffer.isBuffer(req.body)) {
      rawBody = req.body.toString('utf8');
    } else {
      rawBody = JSON.stringify(req.body);
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      console.error("❌ Invalid webhook signature - possible tampering attempt");
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Parse body if it's a string
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Extract event data
    const { event, payload } = body;
    const paymentEntity = payload?.payment?.entity;
    const refundEntity = payload?.refund?.entity;
    const orderEntity = payload?.order?.entity;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🔔 Webhook received: ${event}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.log(`${'='.repeat(60)}\n`);

    // Handle different webhook events
    switch (event) {
      case "payment.captured":
        await handlePaymentCaptured(paymentEntity);
        break;

      case "payment.failed":
        await handlePaymentFailed(paymentEntity);
        break;

      case "payment.authorized":
        await handlePaymentAuthorized(paymentEntity);
        break;

      case "refund.created":
        await handleRefundCreated(refundEntity);
        break;

      case "order.paid":
        await handleOrderPaid(orderEntity);
        break;

      default:
        console.log(`ℹ️ Unhandled webhook event: ${event}`);
    }

    // Always respond with 200 to acknowledge receipt
    // This prevents Razorpay from retrying the webhook
    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully"
    });

  } catch (error) {
    console.error("❌ Error processing webhook:", error);

    // Still return 200 to prevent Razorpay from retrying
    // Log the error for manual investigation
    return res.status(200).json({
      success: false,
      message: "Webhook received but processing failed"
    });
  }
};

/**
 * Handle successful payment capture
 * This is the most important event - indicates payment was successful
 */
const handlePaymentCaptured = async (paymentEntity: any) => {
  try {
    if (!paymentEntity) {
      console.error("❌ Payment entity is null/undefined");
      return;
    }

    console.log(`📦 Processing payment.captured for: ${paymentEntity.id}`);
    console.log(`   Order ID: ${paymentEntity.order_id}`);
    console.log(`   Amount: ₹${(paymentEntity.amount / 100).toFixed(2)}`);
    console.log(`   Method: ${paymentEntity.method}`);
    console.log(`   Contact: ${paymentEntity.contact}`);

    // Check if payment already exists in database
    const existingPayment = await Payment.findOne({
      razorpayPaymentId: paymentEntity.id,
    });

    if (existingPayment) {
      // Payment already exists - just update status and details
      console.log(`📝 Updating existing payment record: ${existingPayment._id}`);

      existingPayment.status = "captured";
      existingPayment.method = paymentEntity.method;
      existingPayment.email = paymentEntity.email;
      existingPayment.contact = paymentEntity.contact;

      await existingPayment.save();

      // Update associated order status if order exists
      if (existingPayment.order) {
        await Order.findByIdAndUpdate(
          existingPayment.order,
          {
            paymentStatus: "paid",
            status: "confirmed",
          }
        );
        console.log(`📦 Updated order status: ${existingPayment.order}`);
      }

      console.log(`✅ Payment updated successfully: ${paymentEntity.id}`);

    } else {
      // Payment doesn't exist - this means frontend flow failed
      // Create payment record from webhook as backup
      console.warn(`⚠️ Payment not found in database - creating from webhook`);
      console.warn(`   This usually means the frontend flow failed or was interrupted`);

      // Try to find user by contact number
      const user = await findUserByContact(paymentEntity.contact);

      if (!user) {
        console.error(`❌ CRITICAL: Cannot create payment record - User not found!`);
        console.error(`   Payment Details for Manual Recovery:`);
        console.error(`   - Razorpay Payment ID: ${paymentEntity.id}`);
        console.error(`   - Razorpay Order ID: ${paymentEntity.order_id}`);
        console.error(`   - Amount: ₹${(paymentEntity.amount / 100).toFixed(2)}`);
        console.error(`   - Contact: ${paymentEntity.contact}`);
        console.error(`   - Email: ${paymentEntity.email}`);
        console.error(`   - Method: ${paymentEntity.method}`);
        console.error(`   - Timestamp: ${new Date().toISOString()}`);
        console.error(`   ⚠️ ACTION REQUIRED: Admin must manually link this payment to user`);

        // TODO: Consider sending alert to admin (email/SMS/Slack)
        return;
      }

      // User found - create payment record
      const newPayment = await Payment.create({
        user: user._id,
        order: null, // Order might not exist since frontend flow failed
        razorpayOrderId: paymentEntity.order_id,
        razorpayPaymentId: paymentEntity.id,
        razorpaySignature: "webhook_generated", // Placeholder since webhooks don't provide signature
        amount: paymentEntity.amount / 100, // Convert paise to rupees
        currency: paymentEntity.currency.toUpperCase(),
        status: "captured",
        method: paymentEntity.method,
        email: paymentEntity.email,
        contact: paymentEntity.contact,
      });

      console.log(`✅ Payment record created from webhook:`);
      console.log(`   Payment ID (DB): ${newPayment._id}`);
      console.log(`   User: ${user.name} (${user.phone})`);
      console.log(`   Amount: ₹${newPayment.amount.toFixed(2)}`);
      console.log(`   ⚠️ Note: Order was not created. Customer may need support.`);

      // TODO: Consider notifying admin about orphaned payment
    }

  } catch (error) {
    console.error("❌ Error handling payment.captured:", error);
    if (error instanceof Error) {
      console.error(`   Error message: ${error.message}`);
      console.error(`   Stack trace: ${error.stack}`);
    }
    throw error;
  }
};

/**
 * Handle failed payment
 * Log failed attempts for analytics and user support
 */
const handlePaymentFailed = async (paymentEntity: any) => {
  try {
    if (!paymentEntity) {
      console.error("❌ Payment entity is null/undefined");
      return;
    }

    console.log(`❌ Processing payment.failed for: ${paymentEntity.id}`);
    console.log(`   Order ID: ${paymentEntity.order_id}`);
    console.log(`   Error Code: ${paymentEntity.error_code}`);
    console.log(`   Error Description: ${paymentEntity.error_description}`);
    console.log(`   Contact: ${paymentEntity.contact}`);

    // Check if payment already exists
    const existingPayment = await Payment.findOne({
      razorpayPaymentId: paymentEntity.id,
    });

    if (existingPayment) {
      // Update existing payment with failure details
      existingPayment.status = "failed";
      existingPayment.errorCode = paymentEntity.error_code;
      existingPayment.errorDescription = paymentEntity.error_description;
      await existingPayment.save();

      // Update associated order to cancelled
      if (existingPayment.order) {
        await Order.findByIdAndUpdate(
          existingPayment.order,
          {
            paymentStatus: "failed",
            status: "cancelled",
          }
        );
        console.log(`📦 Order cancelled: ${existingPayment.order}`);
      }

      console.log(`⚠️ Payment marked as failed: ${paymentEntity.id}`);

    } else {
      // Create failed payment record for tracking
      const user = await findUserByContact(paymentEntity.contact);

      if (!user) {
        console.error(`❌ Cannot log failed payment - User not found for contact: ${paymentEntity.contact}`);
        console.error(`   Failed Payment Details (not saved):`);
        console.error(`   - Payment ID: ${paymentEntity.id}`);
        console.error(`   - Order ID: ${paymentEntity.order_id}`);
        console.error(`   - Error: ${paymentEntity.error_code} - ${paymentEntity.error_description}`);
        return;
      }

      // Create failed payment record
      await Payment.create({
        user: user._id,
        order: null,
        razorpayOrderId: paymentEntity.order_id,
        razorpayPaymentId: paymentEntity.id,
        razorpaySignature: "webhook_generated",
        amount: paymentEntity.amount / 100,
        currency: paymentEntity.currency.toUpperCase(),
        status: "failed",
        errorCode: paymentEntity.error_code,
        errorDescription: paymentEntity.error_description,
        method: paymentEntity.method,
        email: paymentEntity.email,
        contact: paymentEntity.contact,
      });

      console.log(`⚠️ Failed payment logged for user: ${user.phone}`);
    }
  } catch (error) {
    console.error("❌ Error handling payment.failed:", error);
    if (error instanceof Error) {
      console.error(`   Error message: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Handle authorized payment (pending capture)
 * This happens when auto-capture is disabled
 */
const handlePaymentAuthorized = async (paymentEntity: any) => {
  try {
    if (!paymentEntity) {
      console.error("❌ Payment entity is null/undefined");
      return;
    }

    console.log(`🔒 Processing payment.authorized for: ${paymentEntity.id}`);

    const existingPayment = await Payment.findOne({
      razorpayPaymentId: paymentEntity.id,
    });

    if (existingPayment) {
      existingPayment.status = "authorized";
      await existingPayment.save();
      console.log(`✅ Payment marked as authorized: ${paymentEntity.id}`);
    } else {
      console.log(`ℹ️ Authorized payment not found in DB: ${paymentEntity.id}`);
      console.log(`   This is normal - payment will be captured later`);
    }
  } catch (error) {
    console.error("❌ Error handling payment.authorized:", error);
    throw error;
  }
};

/**
 * Handle refund creation
 * Update payment and order status when refund is processed
 */
const handleRefundCreated = async (refundEntity: any) => {
  try {
    if (!refundEntity) {
      console.error("❌ Refund entity is null/undefined");
      return;
    }

    console.log(`💰 Processing refund.created for payment: ${refundEntity.payment_id}`);
    console.log(`   Refund ID: ${refundEntity.id}`);
    console.log(`   Refund Amount: ₹${(refundEntity.amount / 100).toFixed(2)}`);

    const payment = await Payment.findOne({
      razorpayPaymentId: refundEntity.payment_id,
    });

    if (!payment) {
      console.error(`❌ Payment not found for refund: ${refundEntity.payment_id}`);
      console.error(`   Refund ID: ${refundEntity.id}`);
      console.error(`   Amount: ₹${(refundEntity.amount / 100).toFixed(2)}`);
      return;
    }

    // Update payment with refund details
    payment.status = "refunded";
    payment.refundId = refundEntity.id;
    payment.refundAmount = refundEntity.amount / 100; // Convert paise to rupees
    payment.refundedAt = new Date();
    await payment.save();

    // Update order status if order exists
    if (payment.order) {
      await Order.findByIdAndUpdate(
        payment.order,
        {
          paymentStatus: "refunded",
          status: "cancelled",
        }
      );
      console.log(`📦 Order status updated to refunded: ${payment.order}`);
    }

    console.log(`✅ Refund processed successfully:`);
    console.log(`   Payment ID: ${payment._id}`);
    console.log(`   Refund Amount: ₹${payment.refundAmount?.toFixed(2)}`);
    console.log(`   User: ${payment.user}`);

  } catch (error) {
    console.error("❌ Error handling refund.created:", error);
    if (error instanceof Error) {
      console.error(`   Error message: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Handle order paid event
 * Triggered when all payments for an order are completed
 */
const handleOrderPaid = async (orderEntity: any) => {
  try {
    if (!orderEntity) {
      console.error("❌ Order entity is null/undefined");
      return;
    }

    console.log(`💵 Processing order.paid event: ${orderEntity.id}`);
    console.log(`   Amount: ₹${(orderEntity.amount / 100).toFixed(2)}`);
    console.log(`   Status: ${orderEntity.status}`);

    // Find all payments associated with this order
    const payments = await Payment.find({
      razorpayOrderId: orderEntity.id
    });

    console.log(`   Found ${payments.length} payment(s) for this order`);

    // Log payment details
    payments.forEach((payment, index) => {
      console.log(`   Payment ${index + 1}:`);
      console.log(`     - ID: ${payment.razorpayPaymentId}`);
      console.log(`     - Status: ${payment.status}`);
      console.log(`     - Amount: ₹${payment.amount.toFixed(2)}`);
    });

    // You can add additional order-level processing here
    // For example: send confirmation email, trigger fulfillment, etc.

  } catch (error) {
    console.error("❌ Error handling order.paid:", error);
    if (error instanceof Error) {
      console.error(`   Error message: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Admin endpoint to manually trigger webhook processing for testing
 * Use this to test webhook handlers without actual Razorpay events
 */
export const testWebhook = async (req: Request, res: Response) => {
  try {
    const { event, paymentId, orderId, amount, contact, errorCode, errorDescription } = req.body;

    if (!event) {
      return res.status(400).json({ message: "Event type is required" });
    }

    console.log(`\n🧪 Testing webhook event: ${event}`);

    // Simulate webhook payload
    const testPayload = {
      id: paymentId || `pay_test_${Date.now()}`,
      order_id: orderId || `order_test_${Date.now()}`,
      amount: amount || 50000, // in paise (default ₹500)
      currency: "INR",
      method: "card",
      email: "test@example.com",
      contact: contact || "+919876543210",
      error_code: errorCode || "BAD_REQUEST_ERROR",
      error_description: errorDescription || "Test failure for testing purposes",
    };

    // Process based on event type
    switch (event) {
      case "payment.captured":
        await handlePaymentCaptured(testPayload);
        break;

      case "payment.failed":
        await handlePaymentFailed(testPayload);
        break;

      case "payment.authorized":
        await handlePaymentAuthorized(testPayload);
        break;

      case "refund.created":
        const refundPayload = {
          id: `rfnd_test_${Date.now()}`,
          payment_id: paymentId || "pay_test123",
          amount: amount || 50000,
        };
        await handleRefundCreated(refundPayload);
        break;

      case "order.paid":
        const orderPayload = {
          id: orderId || "order_test123",
          amount: amount || 50000,
          status: "paid",
        };
        await handleOrderPaid(orderPayload);
        break;

      default:
        return res.status(400).json({
          message: "Invalid event type",
          validEvents: ["payment.captured", "payment.failed", "payment.authorized", "refund.created", "order.paid"]
        });
    }

    return res.status(200).json({
      success: true,
      message: `Test webhook '${event}' processed successfully`,
      payload: testPayload
    });

  } catch (error) {
    console.error("❌ Error in test webhook:", error);
    const message = error instanceof Error ? error.message : "Test webhook failed";
    res.status(500).json({
      success: false,
      message
    });
  }
};

/**
 * Admin endpoint to lookup user by contact number
 * Useful for debugging webhook issues
 */
export const testUserLookup = async (req: Request, res: Response) => {
  try {
    const { contact } = req.body;

    if (!contact) {
      return res.status(400).json({ message: "Contact number is required" });
    }

    console.log(`\n🔍 Testing user lookup for contact: ${contact}`);

    const user = await findUserByContact(contact);

    if (user) {
      return res.status(200).json({
        found: true,
        user: {
          _id: user._id,
          phone: user.phone,
          name: user.name
        },
        message: "User found successfully"
      });
    } else {
      // Try to show why user wasn't found
      const normalizedContact = normalizePhone(contact);
      const allUsers = await User.find({}).select('phone name');

      const phoneComparisons = allUsers.map(u => ({
        name: u.name,
        storedPhone: u.phone,
        normalizedStored: normalizePhone(u.phone),
        searchPhone: contact,
        normalizedSearch: normalizedContact,
        match: normalizePhone(u.phone) === normalizedContact
      }));

      return res.status(404).json({
        found: false,
        message: "User not found",
        debug: {
          searchedContact: contact,
          normalizedContact: normalizedContact,
          totalUsersInDB: allUsers.length,
          phoneComparisons: phoneComparisons.slice(0, 5) // Show first 5 for debugging
        }
      });
    }
  } catch (error) {
    console.error("❌ Error in testUserLookup:", error);
    const message = error instanceof Error ? error.message : "Lookup failed";
    res.status(500).json({ message });
  }
};