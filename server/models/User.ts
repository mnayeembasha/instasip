import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserDocument extends mongoose.Document {
    name: string;
    phone: string;
    email: string;
    isEmailVerified: boolean;
    password: string;
    isAdmin: boolean;
    verificationOtp?: string;
    otpExpiresAt?: Date;
    lastOtpSentAt?: Date; // For rate limiting
}

const userSchema = new mongoose.Schema<UserDocument>({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^[+]?[\d\s-()]+$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    verificationOtp: {
        type: String,
        select: false
    },
    otpExpiresAt: {
        type: Date,
        select: false
    },
    lastOtpSentAt: {
        type: Date,
        select: false
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (error: any) {
        next(error);
    }
});

export const User = mongoose.model<UserDocument>("User", userSchema);