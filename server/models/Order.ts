import mongoose from 'mongoose';

export interface OrderItemDocument {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
}

export interface OrderDocument extends mongoose.Document {
    user: mongoose.Schema.Types.ObjectId;
    items: OrderItemDocument[];
    subtotal: number;
    gstAmount: number;
    gstPercentage: number;
    deliveryCharge: number;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderDate: Date;
    deliveredAt?: Date;
}

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

const orderSchema = new mongoose.Schema<OrderDocument>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    gstAmount: {
        type: Number,
        required: true,
        min: 0
    },
    gstPercentage: {
        type: Number,
        required: true,
        default: 5
    },
    deliveryCharge: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true, default: 'India' }
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    razorpayOrderId: {
        type: String,
        required: true
    },
    razorpayPaymentId: {
        type: String,
        required: true
    },
    razorpaySignature: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true
});

export const Order = mongoose.model<OrderDocument>("Order", orderSchema);