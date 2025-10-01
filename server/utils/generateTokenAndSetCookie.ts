import { type Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const generateTokenAndSetCookie = (userId: string, res: Response) => {
    const token = jwt.sign({ userId }, JWT_SECRET!, { expiresIn: "7d" });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // prevent XSS attacks
        sameSite: "strict", // CSRF attacks
        secure: process.env.NODE_ENV === "production", // HTTPS in production
    });
};