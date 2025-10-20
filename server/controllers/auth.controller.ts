import { type Request, type Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie";
import { sendVerificationOtp } from "../services/emailService";
import { NODE_ENV } from "../config";

const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendRegistrationOtp = async (req: Request, res: Response) => {
    try {
        const { name, phone, email, password } = req.body;

        // Validation
        if (!name || !phone || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists with verified email
        const existingUserByPhone = await User.findOne({ phone, isEmailVerified: true });
        if (existingUserByPhone) {
            return res.status(400).json({ message: "User with this phone number already exists" });
        }

        const existingUserByEmail = await User.findOne({ email, isEmailVerified: true });
        if (existingUserByEmail) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Check for unverified user (from previous attempt)
        let tempUser = await User.findOne({ 
            email, 
            isEmailVerified: false 
        }).select('+lastOtpSentAt');

        // Rate limiting: 1 minute between OTP requests
        if (tempUser && tempUser.lastOtpSentAt) {
            const timeSinceLastOtp = Date.now() - tempUser.lastOtpSentAt.getTime();
            const oneMinute = 60 * 1000;
            
            if (timeSinceLastOtp < oneMinute) {
                const remainingSeconds = Math.ceil((oneMinute - timeSinceLastOtp) / 1000);
                return res.status(429).json({ 
                    message: `Please wait ${remainingSeconds} seconds before requesting a new OTP` 
                });
            }
        }

        // Generate OTP
        const otp = generateOtp();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        const lastOtpSentAt = new Date();

        if (tempUser) {
            // Update existing unverified user
            tempUser.name = name;
            tempUser.phone = phone;
            tempUser.password = password;
            tempUser.verificationOtp = otp;
            tempUser.otpExpiresAt = otpExpiresAt;
            tempUser.lastOtpSentAt = lastOtpSentAt;
            await tempUser.save();
        } else {
            // Create temporary unverified user
            tempUser = await User.create({
                name,
                phone,
                email,
                password,
                verificationOtp: otp,
                otpExpiresAt,
                lastOtpSentAt,
                isEmailVerified: false,
            });
        }

        // Send verification email
        await sendVerificationOtp(email, otp, name);

        return res.status(200).json({
            message: "OTP sent successfully to your email",
            email: email,
            expiresIn: 600 // 10 minutes in seconds
        });
    } catch (error) {
        console.error("Error in sendRegistrationOtp controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const verifyAndRegister = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email, isEmailVerified: false })
            .select('+verificationOtp +otpExpiresAt');
        
        if (!user) {
            return res.status(404).json({ message: "User not found or already verified" });
        }

        if (!user.verificationOtp || !user.otpExpiresAt) {
            return res.status(400).json({ message: "OTP not found. Please request a new OTP" });
        }

        if (new Date() > user.otpExpiresAt) {
            return res.status(400).json({ message: "OTP has expired. Please request a new OTP" });
        }

        if (user.verificationOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Verify user and clear OTP data
        user.isEmailVerified = true;
        user.verificationOtp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        // Generate token and set cookie
        generateTokenAndSetCookie(user._id.toString(), res);

        return res.status(201).json({
            message: "Email verified and registration completed successfully",
            user: {
                _id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                isAdmin: user.isAdmin,
                isEmailVerified: user.isEmailVerified,
            },
        });
    } catch (error) {
        console.error("Error in verifyAndRegister controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Resend OTP
export const resendOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email, isEmailVerified: false })
            .select('+verificationOtp +otpExpiresAt +lastOtpSentAt');
        
        if (!user) {
            return res.status(404).json({ message: "User not found or already verified" });
        }

        // Rate limiting: 1 minute between OTP requests
        if (user.lastOtpSentAt) {
            const timeSinceLastOtp = Date.now() - user.lastOtpSentAt.getTime();
            const oneMinute = 60 * 1000;
            
            if (timeSinceLastOtp < oneMinute) {
                const remainingSeconds = Math.ceil((oneMinute - timeSinceLastOtp) / 1000);
                return res.status(429).json({ 
                    message: `Please wait ${remainingSeconds} seconds before requesting a new OTP` 
                });
            }
        }

        // Generate new OTP
        const otp = generateOtp();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        const lastOtpSentAt = new Date();

        user.verificationOtp = otp;
        user.otpExpiresAt = otpExpiresAt;
        user.lastOtpSentAt = lastOtpSentAt;
        await user.save();

        await sendVerificationOtp(email, otp, user.name);

        return res.status(200).json({ 
            message: "OTP sent successfully",
            expiresIn: 600 // 10 minutes in seconds
        });
    } catch (error) {
        console.error("Error in resendOtp controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Login
export const login = async (req: Request, res: Response) => {
    try {
        const { phone, password } = req.body;

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(401).json({ message: "Invalid phone number or password" });
        }

        // if (!user.isEmailVerified) {
        //     return res.status(403).json({ 
        //         message: "Please verify your email first",
        //         email: user.email 
        //     });
        // }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid phone number or password" });
        }

        generateTokenAndSetCookie(user._id.toString(), res);
        return res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                isAdmin: user.isAdmin,
                isEmailVerified: user.isEmailVerified,
            },
        });
    } catch (error) {
        console.error("Error in login controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Logout
export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: NODE_ENV === "production" ? "none" : "lax",
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error in logout controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get current user
export const getMe = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        return res.status(200).json({
            message: "User data fetched successfully",
            user: {
                _id: user?._id,
                name: user?.name,
                phone: user?.phone,
                email: user?.email,
                isAdmin: user?.isAdmin,
                isEmailVerified: user?.isEmailVerified,
            },
        });
    } catch (error) {
        console.error("Error in getMe controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};