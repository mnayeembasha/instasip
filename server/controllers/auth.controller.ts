import { type Request, type Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie";
import {NODE_ENV} from "../config";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, phone, password } = req.body;
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: "User with this phone number already exists" });
        }
        const newUser = await User.create({
            name,
            phone,
            password,
        });
        generateTokenAndSetCookie(newUser._id.toString(), res);
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                phone: newUser.phone,
                isAdmin: newUser.isAdmin,
                isPhoneVerified: newUser.isPhoneVerified,
            },
        });
    } catch (error) {
        console.error("Error in register controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(401).json({ message: "Invalid phone number or password" });
        }
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
                isAdmin: user.isAdmin,
                isPhoneVerified: user.isPhoneVerified,
            },
        });
    } catch (error) {
        console.error("Error in login controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

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

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        return res.status(200).json({
            message: "User data fetched successfully",
            user: {
                _id: user?._id,
                name: user?.name,
                phone: user?.phone,
                isAdmin: user?.isAdmin,
                isPhoneVerified: user?.isPhoneVerified,
            },
        });
    } catch (error) {
        console.error("Error in getMe controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};