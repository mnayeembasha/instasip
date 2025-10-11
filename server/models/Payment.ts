import mongoose from 'mongoose';

export interface PaymentDocument extends mongoose.Document {
    user: mongoose.Schema.Types.ObjectId;
    order: mongoose.Schema.Types.ObjectId;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    amount: number;
    currency: string;
    status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
    method?: string;
    email?: string;
    contact?: string;
    errorCode?: string;
    errorDescription?: string;
    refundId?: string;
    refundAmount?: number;
    refundedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new mongoose.Schema<PaymentDocument>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: null
    },
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true
    },
    razorpayPaymentId: {
        type: String,
        required: true,
        unique: true
    },
    razorpaySignature: {
        type: String,
        required: true,
        default:'pending' //default value to prevent validation errors.

    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
        default: 'captured'
    },
    method: {
        type: String
    },
    email: {
        type: String
    },
    contact: {
        type: String
    },
    errorCode: {
        type: String
    },
    errorDescription: {
        type: String
    },
    refundId: {
        type: String
    },
    refundAmount: {
        type: Number
    },
    refundedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for faster queries
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });
paymentSchema.index({ status: 1 });

paymentSchema.pre('save', function(next) {
  if (!this.razorpaySignature) {
    this.razorpaySignature = 'webhook_generated';
  }
  next();
});
export const Payment = mongoose.model<PaymentDocument>("Payment", paymentSchema);
