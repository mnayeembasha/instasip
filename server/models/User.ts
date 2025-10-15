import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserDocument extends mongoose.Document {
    name: string;
    phone: string;
    password: string;
    isAdmin: boolean;
    isPhoneVerified: boolean;
    // otp?: string;
    // otpExpiresAt?: Date;
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
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    // otp: {
    //     type: String,
    //     select: false
    // },
    // otpExpiresAt: {
    //     type: Date,
    //     select: false
    // }
}, {
    timestamps: true
});

userSchema.index({ phone: 1 });

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